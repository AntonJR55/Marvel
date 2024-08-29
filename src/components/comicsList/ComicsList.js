import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./comicsList.scss";

const ComicsList = () => {
    const [comicsList, setComicsList] = useState([]);
    const [newLoading, setNewLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);
    const [pageEnded, setPageEnded] = useState(false);
    const [offset, setOffset] = useState(0);

    const { loading, getAllComics, error } = useMarvelService();

    useEffect(() => {
        updateComicsList(offset, true);
        window.addEventListener("scroll", checkPageEnded);
        return () => {
            window.removeEventListener("scroll", checkPageEnded);
        };
    }, []);

    useEffect(() => {
        updateComicsListByScroll();
    }, [pageEnded]);

    const updateComicsList = (offset, initial) => {
        initial ? setNewLoading(false) : setNewLoading(true);
        getAllComics(offset).then(onComicsListLoaded);
    };

    const onComicsListLoaded = (newComicsList) => {
        setComicsList((comicsList) => [...comicsList, ...newComicsList]);
        setComicsEnded(newComicsList.length < 8);
        setNewLoading(false);
        setPageEnded(false);
        setOffset((offset) => offset + 8);
    };

    const updateComicsListByScroll = () => {
        if (pageEnded && !newLoading && !comicsEnded) {
            updateComicsList(offset);
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

    const items = renderItems(comicsList);

    const spinner = loading || newLoading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;

    return (
        <div className="comics__list">
            {items}
            {spinner}
            {errorMessage}
        </div>
    );
};

export default ComicsList;
