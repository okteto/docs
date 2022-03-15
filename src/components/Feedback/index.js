import React, {useRef, useState} from 'react';

const Feedback = (props) => {

  const form = useRef(null)

  const submit = e => {

    e.preventDefault();
    
    const data = {
      feedback: form.current.feedback.value,
      helpful: form.current.helpful.value,
      pageURL: window.location.href
    }

    console.log(data);

    fetch('/.netlify/functions/gather-feedback/', { method: 'POST', body: data })
  }

  return (
    <form ref={form} onSubmit={submit}>
      <label>
        <input type="radio" name="helpful" value="yes" />
        Yes
      </label>
      <label>
        <input type="radio" name="helpful" value="no" />
        No
      </label>
      <textarea name="feedback"></textarea>
      <input type="submit" name="Submit" />
    </form>
  )
}

export default Feedback;