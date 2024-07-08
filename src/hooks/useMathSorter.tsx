import matchSorter from 'match-sorter';
import { useState } from 'react';

const useMathSorter = ({ data, keys }) => {
    const [search, setSearch] = useState([]);
    const [t, setT] = useState<string>('');
    const handleDebounce = _.debounce((v: string) => {
        setSearch(matchSorter(data, v, { keys: [...keys] }));
    }, 500);
    const onSearch = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const v = e.target.value;
        setT(v);

        handleDebounce(v);
    };

    const clearText = () => {
        setT('');
        setSearch([]);
    };

    return { search, onSearch, clearText, t };
};

export default useMathSorter;
