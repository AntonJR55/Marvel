import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./charList.scss";

const CharList = ({ charId, onCharSelected }) => {
    const [charList, setCharList] = useState([]);
    const [charListLoading, setCharListLoading] = useState(true);
    const [newCharListLoading, setNewCharListLoading] = useState(false);
    const [error, setError] = useState(false);
    const [charEnded, setCharEnded] = useState(false);
    const [pageEnded, setPageEnded] = useState(false);
    const [offset, setOffset] = useState(210);

    const marvelService = new MarvelService();

    useEffect(() => {
        updateCharList();

        window.addEventListener("scroll", checkPageEnded);
        console.log("scroll");
        return () => {
            window.removeEventListener("scroll", checkPageEnded);
            console.log("unscroll");
        };
    }, []);

    useEffect(() => {
        updateCharListByScroll();
    }, [pageEnded]);

    const updateCharList = (offset) => {
        marvelService
            .getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError);
    };

    const onCharListLoaded = (newCharList) => {
        setCharList((charList) => [...charList, ...newCharList]);
        setCharListLoading(false);
        setNewCharListLoading(false);
        setCharEnded(newCharList.length < 9);
        setPageEnded(false);
        setOffset((offset) => offset + 9);
    };

    const updateCharListByScroll = () => {
        if (pageEnded && !newCharListLoading && !charEnded) {
            setNewCharListLoading(true);
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

    const onError = () => {
        setCharListLoading(false);
        setNewCharListLoading(false);
        setError(true);
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

    const content = !(charListLoading || error) ? items : null;
    const spinner = charListLoading || newCharListLoading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;

    return (
        <div className="char__list">
            {content}
            {spinner}
            {errorMessage}
        </div>
    );
};

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
