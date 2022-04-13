import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ModalContainer } from '../components';
import { store } from '../config/store';

class ModalController {
  constructor({ modalRootId, ModalContainerComponent }) {
    this.modalRootId = modalRootId;
    this.ModalContainerComponent = ModalContainerComponent;

    // Bind methods
    this.doesModalRootExist = this.doesModalRootExist.bind(this);
    this.createModalRoot = this.createModalRoot.bind(this);
    this.deleteModalRoot = this.deleteModalRoot.bind(this);
    this.isModalOpen = this.isModalOpen.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  doesModalRootExist() {
    return Boolean(this.modalRoot);
  }

  createModalRoot() {
    // Create a modalRoot
    // All modals in the app will be attached to the modalRoot
    const modalRoot = document.createElement('div');
    modalRoot.id = this.modalRootId;
    document.body.appendChild(modalRoot);
    this.modalRoot = modalRoot;
  }

  deleteModalRoot() {
    if (!this.modalRoot) return;
    this.modalRoot.remove();
    this.modalRoot = null;
    // Enable scrolling of body
    document.querySelector('body').style.overflow = 'auto';
  }

  isModalOpen(modalId) {
    return Boolean(document.getElementById(modalId));
  }

  openModal({
    modalId,
    Component,
    props = {},
    title = '',
    modalContainerClassName = '',
  }) {
    // If a modal with the same id exists, then don't open the new modal
    if (this.isModalOpen(modalId)) return;
    // If a modalRoot doesn't exist, create it
    // We need just one modalRoot in app, and all of the modals will be attached to it
    if (!this.doesModalRootExist()) this.createModalRoot();

    // Create a modal parent element and attach it to the modalRoot
    const modalParent = document.createElement('div');
    modalParent.id = modalId;
    this.modalRoot.appendChild(modalParent);

    // Render the modal inside the modalParent
    // Because ReactDOM.render doesn't share its contexts,
    // we should wrap modals inside separate contexts,
    // like redux Provider
    ReactDOM.render(
      <BrowserRouter>
        <Provider store={store}>
          <this.ModalContainerComponent
            className={modalContainerClassName}
            onModalClose={() => this.closeModal(modalId)}
            title={title}
          >
            <Component {...props} modalId={modalId} />
          </this.ModalContainerComponent>
        </Provider>
      </BrowserRouter>,
      modalParent
    );

    // Disable scrolling of body
    document.querySelector('body').style.overflow = 'hidden';
  }

  closeModal(modalId) {
    // If a modal with the given id doesn't exist, don't continue
    if (!this.isModalOpen(modalId)) return;

    // Close the modal
    const modalParent = document.getElementById(modalId);
    ReactDOM.unmountComponentAtNode(modalParent);
    modalParent.remove();

    // If there isn't any modal, then delete the modalRoot
    if (this.modalRoot.innerHTML === '') this.deleteModalRoot();

    // Enable scrolling of body
    document.querySelector('body').style.overflow = 'auto';
  }
}

const modalController = new ModalController({
  modalRootId: 'modalRoot',
  ModalContainerComponent: ModalContainer,
});

export { modalController };
