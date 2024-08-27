import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./comicsList.scss";

const ComicsList = () => {
    const [charList, setCharList] = useState([]);
    const [newLoading, setNewLoading] = useState(false);
    const [charEnded, setCharEnded] = useState(false);
    const [pageEnded, setPageEnded] = useState(false);
    const [offset, setOffset] = useState(0);

    const { loading, error, getAllComics } = useMarvelService();

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
        getAllComics(offset).then(onCharListLoaded);
    };

    const onCharListLoaded = (newCharList) => {
        setCharList((charList) => [...charList, ...newCharList]);
        setCharEnded(newCharList.length < 8);
        setNewLoading(false);
        setPageEnded(false);
        setOffset((offset) => offset + 8);
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
            return (
                <li className="comics__item" key={item.id}>
                    <Link to={`/comics/${item.id}`}>
                        <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="comics__item-img"
                        />
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            );
        });

        return <ul className="comics__grid">{items}</ul>;
    };

    const items = renderItems(charList);

    const spinner = loading || newLoading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;

    console.log("render");

    return (
        <div className="comics__list">
            {items}
            {spinner}
            {errorMessage}
        </div>
    );
};

export default ComicsList;
