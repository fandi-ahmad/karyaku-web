import { createGlobalState } from 'react-hooks-global-state'

const initialState = {
  count: 435,
  username: '',
  uuidUser: '',
  alertSuccessEdit: 'opacity-0',
};
const { useGlobalState } = createGlobalState(initialState);

export { useGlobalState }