import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import { client } from '../../config';
import { cartProductsQuery } from '../../graphql/queries';
import { storage } from '../../utils/storage';
import { selectSelectedCurrency } from '../currencies/currenciesSlice';

const productsApadter = createEntityAdapter();

const initialState = productsApadter.getInitialState({
  status: 'idle',
  error: null,
});

export const fetchCartProducts = createAsyncThunk(
  'fetchCartProducts',
  async () => {
    try {
      const cartProductList = storage.load('cartProductList');
      // If there isn't any product in cart, don't continue
      if (!cartProductList || !cartProductList.length) return [];
      const cartProductIds = cartProductList.map(
        (cartProductItem) => cartProductItem.id
      );
      const { data } = await client.query({
        query: cartProductsQuery(cartProductIds),
      });
      // Create 'products' array with a suitable shape
      const products = [];
      for (const key of Object.keys(data)) {
        const product = { ...data[key] };
        const productInCart = cartProductList.find(
          (cartProductItem) => cartProductItem.id === product.id
        );
        // Add 'selectedAttributes' and 'count' from localStorage to product objects in store
        product.selectedAttributes = productInCart.selectedAttributes;
        product.count = productInCart.count;
        products.push(product);
      }
      return products;
    } catch (error) {
      console.log(`Error while fetching cart data: ${error}`);
      throw error;
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialState,
  reducers: {
    productAddedToCart: (state, action) => {
      const product = action.payload;
      const productForLocalStorage = {
        id: product.id,
        selectedAttributes: product.selectedAttributes,
        count: product.count,
      };
      const cartProductList = storage.load('cartProductList');
      // If the 'cartProductList' array exists in the localStorage, then add the new product to it
      // But if 'cartProductList' is null, then create an array with the new product data
      const modifiedCartProductList = cartProductList
        ? [productForLocalStorage, ...cartProductList]
        : [productForLocalStorage];
      // Save 'modifiedCartProductList' to the localStorage
      storage.save('cartProductList', modifiedCartProductList);
      // Add 'product' to the store
      productsApadter.addOne(state, product);
    },
    productEditedInCart: (state, action) => {
      const { productId, attributeId, attributeSelectedItemId, count } =
        action.payload;
      const cartProductList = storage.load('cartProductList');
      const productIndexInCart = cartProductList.findIndex(
        (cartProductItem) => cartProductItem.id === productId
      );
      // If attributes changed
      if (attributeId && attributeSelectedItemId) {
        // Edit the product's selectedAttributes in the 'cartProductList' array
        cartProductList[productIndexInCart].selectedAttributes[attributeId] =
          attributeSelectedItemId;
        // Update the localStorage
        storage.save('cartProductList', cartProductList);
        // Update the store
        state.entities[productId].selectedAttributes[attributeId] =
          attributeSelectedItemId;
      }
      // If count changed
      if (count) {
        // Edit the product's count in the 'cartProductList' array
        cartProductList[productIndexInCart].count = count;
        // Update the localStorage
        storage.save('cartProductList', cartProductList);
        // Update the store
        state.entities[productId].count = count;
      }
    },
    productRemovedFromCart: (state, action) => {
      const productId = action.payload;
      // Remove product from localStorage
      const cartProductList = storage.load('cartProductList');
      const updatedCartProductList = cartProductList.filter(
        (product) => product.id !== productId
      );
      storage.save('cartProductList', updatedCartProductList);
      // Remove product from store
      productsApadter.removeOne(state, productId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        productsApadter.setAll(state, action.payload);
      })
      .addCase(fetchCartProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {
  productAddedToCart,
  productEditedInCart,
  productRemovedFromCart,
} = cartSlice.actions;

export const {
  selectById: selectCartProductById,
  selectIds: selectCartProductIds,
  selectTotal: selectTotalCartItemQuantity,
  selectAll: selectAllCartProducts,
} = productsApadter.getSelectors((state) => state.cart);

export const selectTotalPrice = (state) => {
  let totalPrice = 0;
  const selectedCurrency = selectSelectedCurrency(state);
  if (!selectedCurrency) return '';
  const cartProducts = selectAllCartProducts(state);
  // Loop through all products in cart to calculate the total price
  cartProducts.forEach((cartProduct) => {
    // Select price based on the selected currency
    const price = cartProduct.prices.find(
      (price) => price.currency.label === selectedCurrency.label
    );
    totalPrice += price.amount * cartProduct.count;
  });
  totalPrice = Number.parseFloat(totalPrice).toFixed(2);
  return `${selectedCurrency.symbol}${totalPrice}`;
};

export default cartSlice.reducer;
