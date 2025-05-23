import { createContext } from "react";

export const UserContext = createContext(null);

function UserProvider({ children }) {
    const getUser= JSON.parse(localStorage.getItem('user_data'));
    return (
        <UserContext.Provider value={{ userData : getUser  }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;
