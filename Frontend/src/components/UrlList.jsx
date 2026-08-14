 
import { useState } from "react"
import useUrlStore from "../store/urlstore"

const ShowUrl=() => {
  
  const shortUrl = useUrlStore((store) => store.shortUrl)
  const geturl = useUrlStore((store)=> store.geturl)
  const [copied, setCopied] = useState(false);

  let  copyUrl = shortUrl;
  const handleCopy = async()=>{
    await navigator.clipboard.writeText(copyUrl);
    console.log("copied ......")
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      geturl("")
    }, 2000);
  }

  if (!copyUrl) return null;

  return ( 
    <div className="result" id="result-section">
      <div className={`result__card ${copied ? 'result__card--copied' : ''}`}>
        <span className="result__link-icon">🔗</span>
        <input
          type="text"
          readOnly
          value={copyUrl}
          className="result__url"
          id="result-url"
        />
        <button
          onClick={handleCopy}
          className={`result__copy-btn ${copied ? 'result__copy-btn--copied' : ''}`}
          id="copy-btn"
        >
          {copied ? (
            <>
              <span className="result__check-icon">✓</span>
              Copied!
            </>
          ) : (
            <>📋 Copy</>
          )}
        </button>
      </div>
    </div>
  )
}
export default ShowUrl;