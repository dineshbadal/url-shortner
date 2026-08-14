// import React from "react";
import { useRef, useState } from "react";
import useUrlStore from "../store/urlstore";
import GetShortenUrl from "../services/api"
// *Remove the verbose code and do working on the naming convention also and all the best ...

const UrlForm = () => {
 
  
   const setUrl = useUrlStore((state) => state.setUrl);
    const geturl = useUrlStore((state) => state.geturl)
  
    const [loading, setLoading] = useState(false);

    let urlInput = useRef(null); 
    const Geturlhandler = async() => {
    const urlValue = urlInput.current.value;
    if (!urlValue.trim()) return;
    setLoading(true);
    setUrl(urlValue);
    const shortUrl = await GetShortenUrl(urlValue);
      geturl(shortUrl);
      urlInput.current.value=""
      setLoading(false);
    console.log(`Original URl :${urlValue} and shortUrl ${shortUrl}`);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') Geturlhandler();
  }
  
  return (
    <div className="url-form" id="url-form">
      <div className="url-form__input-wrapper">
        <span className="url-form__icon">🔗</span>
        <input
          type="text"
          ref={urlInput}
          placeholder="Paste your long URL here..."
          className="url-form__input"
          id="url-input"
          onKeyDown={handleKeyDown}
        />
      </div>
      <button
        onClick={Geturlhandler}
        className="url-form__submit"
        id="url-submit-btn"
        disabled={loading}
      >
        {loading ? (
          <span className="url-form__spinner"></span>
        ) : (
          <>
            Shorten
            <span className="url-form__submit-icon">→</span>
          </>
        )}
      </button>
    </div>
  )
  
}
export default UrlForm