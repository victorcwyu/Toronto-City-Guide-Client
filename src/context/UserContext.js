import { createContext } from 'react';

export default createContext(null);

// const UserContext = React.createContext([{}, () => {}]);

// const UserContextProvider = props => {
//   const [state, setState] = useState({
//     count: 0
//   });

//   return (
//     <UserContext.Provider value={[state, setState]}>
//     </UserContext.Provider>
//   );
// };

// export { UserContext, UserContextProvider };