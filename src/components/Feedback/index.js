import React, {useRef, useState} from 'react';

import ThumbsUpIcon from "../../icons/ThumbsUpIcon";
import ThumbsDownIcon from "../../icons/ThumbsDownIcon";

import Button from "../../theme/Button";
import styles from './styles.module.scss';

const Feedback = (props) => {

  const [expanded, setExpanded] = useState(false);

  const form = useRef(null)

  const submit = e => {
    e.preventDefault();
    
    const data = {
      feedback: form.current.feedback.value,
      helpful: form.current.helpful.value,
      pageURL: window.location.href
    }

    fetch('/.netlify/functions/gather-feedback/', { method: 'POST', body: data })
  }

  const handleRadioChange = () => {
    setExpanded(true);
  }

  console.log(expanded);

  return (
    <>
      <h2 className={styles.componentTitle}>Was this page helpful?</h2>
      <form ref={form} onSubmit={submit} className={`${styles.form} ${expanded ? styles.formExpanded : ''}`}>
        <div className={styles.radioContainer}>
          <div className={styles.radio}>
            <input type="radio" name="helpful" value="yes" className={`${styles.radioInput} ${styles.radioYes}`} id="feedback-helpful-yes" onChange={handleRadioChange} />
            <label className={styles.radioLabel} htmlFor="feedback-helpful-yes">
              <ThumbsUpIcon />
            </label>
          </div>
          <div className={styles.radio}>
            <input type="radio" name="helpful" value="no" className={`${styles.radioInput} ${styles.radioNo}`} id="feedback-helpful-no" onChange={handleRadioChange} />
            <label className={styles.radioLabel} htmlFor="feedback-helpful-no">
              <ThumbsDownIcon />
            </label>
          </div>
        </div>
        <textarea name="feedback" className={styles.comment} placeholder="Place add your feedback (optional)" hidden={!expanded}></textarea>
        <Button type="submit" className={styles.submitButton} hidden={!expanded} role="button">
          Submit
        </Button>
      </form>
    </>
  )
}

export default Feedback;