import { Component } from "react";
import PropTypes from "prop-types";

import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import "./charList.scss";

class CharList extends Component {
    state = {
        charList: [],
        charListLoading: true,
        newCharListLoading: false,
        error: false,
        charEnded: false,
        pageEnded: false,
        offset: 210,
    };

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateCharList();

        window.addEventListener("scroll", this.checkPageEnded);
        window.addEventListener("scroll", this.updateCharListByScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.checkPageEnded);
        window.removeEventListener("scroll", this.updateCharListByScroll);
    }

    updateCharList = (offset) => {
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError);
    };

    onCharListLoaded = (newCharList) => {
        this.setState((prevState) => ({
            charList: [...prevState.charList, ...newCharList],
            charListLoading: false,
            newCharListLoading: false,
            charEnded: newCharList.length < 9,
            pageEnded: false,
            offset: prevState.offset + 9,
        }));
    };

    updateCharListByScroll = () => {
        const { pageEnded, charEnded, newCharListLoading, offset } = this.state;

        if (pageEnded && !newCharListLoading && !charEnded) {
            this.setState({ newCharListLoading: true });
            this.updateCharList(offset);
        }
    };

    checkPageEnded = () => {
        if (
            window.scrollY + document.documentElement.clientHeight >=
            document.documentElement.offsetHeight - 3
        ) {
            this.setState({ pageEnded: true });
        }
    };

    onError = () => {
        this.setState({
            charListLoading: false,
            newCharListLoading: false,
            error: true,
        });
    };

    renderItems(arr) {
        const items = arr.map((item) => {
            let imgStyle = { objectFit: "cover" };
            if (
                item.thumbnail ===
                "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
            ) {
                imgStyle = { objectFit: "unset" };
            }

            const active = this.props.charId === item.id;

            const className = active
                ? "char__item char__item_selected"
                : "char__item";

            return (
                <li
                    className={className}
                    key={item.id}
                    tabIndex={0}
                    onFocus={() => {
                        this.props.onCharSelected(item.id);
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
    }

    render() {
        const { charList, charListLoading, newCharListLoading, error } =
            this.state;

        const items = this.renderItems(charList);

        const content = !(charListLoading || error) ? items : null;
        const spinner =
            charListLoading || newCharListLoading ? <Spinner /> : null;
        const errorMessage = error ? <ErrorMessage /> : null;

        return (
            <div className="char__list">
                {content}
                {spinner}
                {errorMessage}
            </div>
        );
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired,
};

export default CharList;
