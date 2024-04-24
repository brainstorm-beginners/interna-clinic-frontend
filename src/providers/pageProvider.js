import { useState } from 'react';
import PageContext from '../contexts/pageContext';

const PageProvider = ({ children }) => {
    const [currentPage, setCurrentPage] = useState(1);
  
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
  
    return (
      <PageContext.Provider value={{ currentPage, handlePageChange }}>
        {children}
      </PageContext.Provider>
    );
};

export default PageProvider;
