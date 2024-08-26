import { useState, useEffect } from "react";
import useMarvelService from "../../services/MarvelService";
import PropTypes from "prop-types";

import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./charList.scss";

const CharList = ({ charId, onCharSelected }) => {
    const [charList, setCharList] = useState([]);
    const [newLoading, setNewLoading] = useState(false);
    const [charEnded, setCharEnded] = useState(false);
    const [pageEnded, setPageEnded] = useState(false);
    const [offset, setOffset] = useState(210);

    const { loading, error, getAllCharacters } = useMarvelService();

    useEffect(() => {
        updateCharList(offset, true);
        window.addEventListener("scroll", checkPageEnded);
        return () => {
            window.removeEventListener("scroll", checkPageEnded);
        };
    }, []);

    useEffect(() => {
        updateCharListByScroll();
    }, [pageEnded]);

    const updateCharList = (offset, initial) => {
        initial ? setNewLoading(false) : setNewLoading(true);
        getAllCharacters(offset).then(onCharListLoaded);
    };

    const onCharListLoaded = (newCharList) => {
        setCharList((charList) => [...charList, ...newCharList]);
        setCharEnded(newCharList.length < 9);
        setNewLoading(false);
        setPageEnded(false);
        setOffset((offset) => offset + 9);
    };

    const updateCharListByScroll = () => {
        if (pageEnded && !newLoading && !charEnded) {
            updateCharList(offset);
        }
    };

    const checkPageEnded = () => {
        if (
            window.scrollY + document.documentElement.clientHeight >=
            document.documentElement.offsetHeight - 3
        ) {
            setPageEnded(true);
        }
    };

    const renderItems = (arr) => {
        const items = arr.map((item) => {
            let imgStyle = { objectFit: "cover" };
            if (
                item.thumbnail ===
                "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
            ) {
                imgStyle = { objectFit: "unset" };
            }

            const active = charId === item.id;

            const className = active
                ? "char__item char__item_selected"
                : "char__item";

            return (
                <li
                    className={className}
                    key={item.id}
                    tabIndex={0}
                    onFocus={() => {
                        onCharSelected(item.id);
                    }}
                >
                    <img
                        src={item.thumbnail}
                        alt={item.name}
                        style={imgStyle}
                    />
                    <div className="char__name">{item.name}</div>
                </li>
            );
        });

        return <ul className="char__grid">{items}</ul>;
    };

    const items = renderItems(charList);

    const spinner = loading || newLoading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;

    return (
        <div className="char__list">
            {items}
            {spinner}
            {errorMessage}
        </div>
    );
};

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
