import React, { useState, useContext, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "react-select";
import useFetch from "../../hooks/useFetch";

import "./style.scss";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/movix-logo.svg";
import searchContext from "../../context/useContext";

const Header = () => {
    const [show, setShow] = useState("top");
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenu, setMobileMenu] = useState(false);
    const { regionValue, setRegionValue } = useContext(searchContext);
    const [query, setQuery] = useState("");
    const [showSearch, setShowSearch] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [region, setRegion] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const controlNavbar = () => {
        if (window.scrollY > 200) {
            if (window.scrollY > lastScrollY && !mobileMenu) {
                setShow("hide");
            } else {
                setShow("show");
            }
        } else {
            setShow("top");
        }
        setLastScrollY(window.scrollY);
    };
    useEffect(() => {

        window.addEventListener("scroll", controlNavbar);
        return () => {
            window.removeEventListener("scroll", controlNavbar);
        };
    }, [lastScrollY]);

    const searchQueryHandler = (event) => {
        if (event.key === "Enter" && query.length > 0) {
            navigate(`/search/${query}`);
            setTimeout(() => {
                setShowSearch(false);
            }, 1000);
        }
    };

    const openSearch = () => {
        setMobileMenu(false);
        setShowSearch(true);
    };

    const openMobileMenu = () => {
        setMobileMenu(true);
        setShowSearch(false);
    };

    const navigationHandler = (type) => {
        if (type === "movie") {
            navigate("/explore/movie");
        } else {
            navigate("/explore/tv");
        }
        setMobileMenu(false);
    };
    const onChange = (selectedItems, action) => {
        setRegionValue((pre) => {
            return { ...pre, ...selectedItems.filter((item) => item) }
        })
        setRegion(regionValue.label)
        console.log(action)
    }


    function newFunction() {
        const { data: regionData } = useFetch(`/watch/providers/regions`);
        let options = []
        for (let index = 0; index < regionData?.results?.length; index++) {
            const element = regionData.results[index];
            options.push({ value: element.iso_3166_1, label: element.english_name })
        }
        return options;
    }
    const regionOption = newFunction();


    return (
        <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
            <ContentWrapper>
                <div className="logo" onClick={() => navigate("/")}>
                    <img src={logo} alt="" />
                </div>
                <ul className="menuItems">
                    <li
                        className="menuItem"
                        onClick={() => navigationHandler("movie")}
                    >
                        Movies
                    </li>
                    <li
                        className="menuItem"
                        onClick={() => navigationHandler("tv")}
                    >
                        TV Shows
                    </li>
                    <li className="menuItem">
                        <HiOutlineSearch onClick={openSearch} />
                    </li>
                </ul>

                <div className="mobileMenuItems">
                    <HiOutlineSearch onClick={openSearch} />
                    {mobileMenu ? (
                        <VscChromeClose onClick={() => setMobileMenu(false)} />
                    ) : (
                        <SlMenu onClick={openMobileMenu} />
                    )}
                </div>
            </ContentWrapper>
            {showSearch && (
                <div className="searchBar">
                    <ContentWrapper>
                        <div className="searchInput">
                            <input
                                type="text"
                                placeholder="Search for a movie or tv show...."
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyUp={searchQueryHandler}
                            />
                            <div className="filters">
                                <Select
                                    name="region"
                                    value={region}
                                    options={regionOption}
                                    onChange={(selectedItems, action) =>
                                        onChange(selectedItems, { ...action, name: "region" })
                                    }
                                    isMulti={true}
                                    isClearable={true}
                                    placeholder="Region"
                                    className="react-select-container sortbyDD"
                                    classNamePrefix="react-select"
                                />

                            </div>
                            <VscChromeClose
                                onClick={() => setShowSearch(false)}
                            />
                        </div>

                    </ContentWrapper>
                </div>
            )}
        </header>
    );
};

export default Header;
