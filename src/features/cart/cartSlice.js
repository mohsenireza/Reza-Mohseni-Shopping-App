import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  nanoid,
} from '@reduxjs/toolkit';
import { client } from '../../config';
import { cartQuery } from '../../graphql/queries';
import { storage } from '../../utils/storage';
import { selectSelectedCurrency } from '../global/globalSlice';

const orderListApadter = createEntityAdapter({
  sortComparer: (a, b) =>
    String(b.addedTimestamp).localeCompare(String(a.addedTimestamp)),
});

const initialState = orderListApadter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchOrderList = createAsyncThunk('fetchOrderList', async () => {
  try {
    const storageOrderList = storage.load('orderList');
    // If there isn't any product in cart, don't continue
    if (!storageOrderList || !storageOrderList.length) return [];
    let orderItemProductIds = storageOrderList.map(
      (orderItem) => orderItem.productId
    );
    // Remove duplicate product ids
    orderItemProductIds = [...new Set(orderItemProductIds)];
    // Fetch data of products
    const { data } = await client.query({
      query: cartQuery(orderItemProductIds),
    });
    // Create 'orderList' array with a suitable shape
    const orderList = storageOrderList.map((storageOrderItem) => {
      let product;
      for (const key in data) {
        if (data[key].id === storageOrderItem.productId) {
          product = data[key];
          break;
        }
      }
      // Create 'orderItem' based on product and localStorage data
      const { id, ...otherProps } = product;
      const orderItem = {
        productId: id,
        ...otherProps,
        ...storageOrderItem,
      };
      return orderItem;
    });
    return orderList;
  } catch (error) {
    console.log(`Error while fetching cart data: ${error}`);
    throw error;
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialState,
  reducers: {
    orderItemAdded: {
      reducer: (state, action) => {
        const orderItem = action.payload;
        const storageOrderItem = {
          id: orderItem.id,
          productId: orderItem.productId,
          selectedAttributes: orderItem.selectedAttributes,
          quantity: orderItem.quantity,
          addedTimestamp: orderItem.addedTimestamp,
        };
        const storageOrderList = storage.load('orderList');
        // If the 'storageOrderList' array exists in the localStorage, then add the new product to it
        // But if 'storageOrderList' is null, then create an array with the new product data
        const modifiedStorageOrderList = storageOrderList
          ? [storageOrderItem, ...storageOrderList]
          : [storageOrderItem];
        // Save 'modifiedStorageOrderList' to the localStorage
        storage.save('orderList', modifiedStorageOrderList);
        // Add 'orderItem' to the store
        orderListApadter.addOne(state, orderItem);
      },
      prepare: (orderItem) => {
        return {
          payload: {
            id: nanoid(),
            ...orderItem,
            quantity: 1,
            addedTimestamp: new Date().getTime(),
          },
        };
      },
    },
    orderItemQuantityEdited: (state, action) => {
      const { orderItemId, quantity } = action.payload;
      // Update the localStorage
      const storageOrderList = storage.load('orderList');
      const storageOrderItem = storageOrderList.find(
        (orderItem) => orderItem.id === orderItemId
      );
      storageOrderItem.quantity = quantity;
      storage.save('orderList', storageOrderList);
      // Update the store
      orderListApadter.updateOne(state, {
        id: orderItemId,
        changes: { quantity },
      });
    },
    orderItemRemoved: (state, action) => {
      const orderItemId = action.payload;
      // Remove product from localStorage
      const storageOrderList = storage.load('orderList');
      const modifiedStorageOrderList = storageOrderList.filter(
        (orderItem) => orderItem.id !== orderItemId
      );
      storage.save('orderList', modifiedStorageOrderList);
      // Remove product from store
      orderListApadter.removeOne(state, orderItemId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderList.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrderList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        orderListApadter.setAll(state, action.payload);
      })
      .addCase(fetchOrderList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { orderItemAdded, orderItemQuantityEdited, orderItemRemoved } =
  cartSlice.actions;

export const {
  selectById: selectOrderItemById,
  selectIds: selectOrderItemIds,
  selectAll: selectOrderList,
} = orderListApadter.getSelectors((state) => state.cart);

export const selectOrderItemByProduct = (
  state,
  { productId, selectedAttributes }
) => {
  const orderList = selectOrderList(state);
  const selectedOrderItem = orderList.find((orderItem) => {
    const hasSameProductId = orderItem.productId === productId;
    const hasSameSelectedAttributes =
      JSON.stringify(orderItem.selectedAttributes) ===
      JSON.stringify(selectedAttributes);
    return hasSameProductId && hasSameSelectedAttributes;
  });
  return selectedOrderItem;
};

export const selectTotalCartItemQuantity = (state) => {
  let totalCartItemQuantity = 0;
  const orderList = selectOrderList(state);
  orderList.forEach(
    (orderItem) => (totalCartItemQuantity += orderItem.quantity)
  );
  return totalCartItemQuantity;
};

export const selectTotalPrice = (state) => {
  let totalPrice = 0;
  const selectedCurrency = selectSelectedCurrency(state);
  if (!selectedCurrency) return '';
  const orderList = selectOrderList(state);
  // Loop through all order items in cart to calculate the total price
  orderList.forEach((orderItem) => {
    // Select price based on the selected currency
    const price = orderItem.prices.find(
      (price) => price.currency.label === selectedCurrency.label
    );
    totalPrice += price.amount * orderItem.quantity;
  });
  totalPrice = Number.parseFloat(totalPrice).toFixed(2);
  return `${selectedCurrency.symbol}${totalPrice}`;
};

export default cartSlice.reducer;
