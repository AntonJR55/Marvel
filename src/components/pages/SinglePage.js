import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import useMarvelService from "../../services/MarvelService";
import AppBanner from "../appBanner/AppBanner";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

const SinglePage = ({ Component, dataType }) => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const { loading, error, getComic, getCharacter, clearError } =
        useMarvelService();

    useEffect(() => {
        updateData();
    }, [id]);

    const updateData = () => {
        clearError();

        // eslint-disable-next-line default-case
        switch (dataType) {
            case "comic":
                getComic(id).then(onDataLoaded);
                break;
            case "character":
                getCharacter(id).then(onDataLoaded);
        }
    };

    const onDataLoaded = (data) => {
        setData(data);
    };

    const content = !(loading || error || !data) ? (
        <Component data={data} />
    ) : null;
    const spinner = loading ? <Spinner /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;

    return (
        <>
            <AppBanner />
            {spinner}
            {content}
            {errorMessage}
        </>
    );
};

export default SinglePage;
