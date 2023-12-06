import { useEffect, useState } from "react";
import searchContext from "./useContext";
const SetSearch = (props) => {
    const [regionValue, setRegionValue] = useState({ value: "", label: null });
    return (
        <searchContext.Provider value={{ regionValue, setRegionValue }}>
            {props.children}
        </searchContext.Provider>
    )
}
export default SetSearch;