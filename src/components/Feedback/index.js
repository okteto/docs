import React, {useRef, useState, useEffect} from 'react';

import ThumbsUpIcon from "../../icons/ThumbsUpIcon";
import ThumbsDownIcon from "../../icons/ThumbsDownIcon";

import Button from "../../theme/Button";
import styles from './styles.module.scss';

const SESSION_STORAGE_KEY = "OktetoDocsFeedback";

const Feedback = () => {
  

  const [expanded, setExpanded] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState ({submitted: false, helpful: ""})
  const [gaveFeedbackForThesePagesURLs, setGaveFeedbackForThesePagesURLs] = useState(sessionStorage.getItem(SESSION_STORAGE_KEY) || false);

  const form = useRef(null)

  useEffect(() => {
    setPageTitle(document.title.replace(" | Okteto Documentation", ""));

    if(gaveFeedbackForThesePagesURLs) {
      const pages = JSON.parse(gaveFeedbackForThesePagesURLs);
      const currentPageFeedback = pages.find(page => page.url === window.location.href);
      if(currentPageFeedback) {
        setFeedback({submitted: true, helpful: currentPageFeedback.helpful})
      }
    }
  }, [])

  const submit = e => {
    e.preventDefault();
    
    setLoading(true);

    const data = {
      feedback: form.current.feedback.value,
      helpful: form.current.helpful.value,
      pageURL: window.location.href,
      pageTitle: pageTitle,
      submittedOn: new Date().toLocaleDateString('en-CA')
    }

    handleSessionStorage({url: data.pageURL, helpful: data.helpful});

    fetch('/.netlify/functions/gather-feedback', { method: 'POST', body: JSON.stringify(data) }).then(response => {
      if(response.status === 200) setFeedback({submitted: true})
      setLoading(false);
    })
  }

  const handleSessionStorage = ({url, helpful}) => {
    let pageURLs = JSON.parse(gaveFeedbackForThesePagesURLs) || [];
    pageURLs.push({url: url, helpful});
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(pageURLs));
  }

  const handleRadioChange = () => {
    setFeedback({helpful: form.current.helpful.value})
    setExpanded(true);
  }

  return (
    <>
      <h2 className={styles.componentTitle}>Was this page helpful?</h2>
      <form ref={form} onSubmit={submit} className={`${styles.form} ${expanded || feedback.submitted ? styles.formExpanded : ''}`}>
        <div className={styles.radioContainer}>
          <div className={styles.radio}>
            <input type="radio" name="helpful" value="yes" checked={feedback.helpful === "yes"} className={`${styles.radioInput} ${styles.radioYes}`} id="feedback-helpful-yes" onChange={handleRadioChange} />
            <label className={styles.radioLabel} htmlFor="feedback-helpful-yes">
              <ThumbsUpIcon />
            </label>
          </div>
          <div className={styles.radio}>
            <input type="radio" name="helpful" value="no" checked={feedback.helpful === "no"} className={`${styles.radioInput} ${styles.radioNo}`} id="feedback-helpful-no" onChange={handleRadioChange} />
            <label className={styles.radioLabel} htmlFor="feedback-helpful-no">
              <ThumbsDownIcon />
            </label>
          </div>
        </div>
        {!feedback.submitted &&
          <>
            <textarea name="feedback" className={styles.comment} placeholder="Place add your feedback (optional)" hidden={!expanded}></textarea>
            <Button type="submit" className={styles.submitButton} hidden={!expanded} role="button" loading={loading}>
              Submit
            </Button>
          </>
        }
        {feedback.submitted &&
          <p className={styles.feedbackTitle}>Thanks for the feedback!</p>
        }
      </form>
    </>
  )
}

export default Feedback;