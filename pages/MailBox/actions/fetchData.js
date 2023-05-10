//here are the methods of fetchData api
//error
export function mailsHasErrored(bool) {
    return {
        type: 'HAS_ERRORED',
        hasErrored: bool
    };
}
//success and return mail data
export function mailsFetchDataSuccess(items) {
    return {
        type: 'FETCH_DATA_SUCCESS',
        mails: items // Pass the items to the payload
     
    };
}

//get remote mails (json-server ‘GET’)
export function fetchData(url) {
    return (dispatch) => {
      return new Promise((resolve, reject) => {
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            dispatch(mailsFetchDataSuccess(data.mails)); // Pass the mails to the payload
            resolve();
          })
          .catch(() => {
            dispatch(mailsHasErrored(true)); // If an error occurs
            reject();
          });
      });
    };
  }
  


//post new mail (json-server ‘POST’)
export function postData(url, address, message, subject){
    return (dispatch) => {
        fetch(url, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "from" : "zhengren prototype",
                "address" : address,
                "time": timeFormat(new Date()),
                "message" : message,
                "subject" : subject,
                "tag" :"sent",
                "read":"true"
            })
        })
        .then((response) => response.json())
        .then((mails) => dispatch(mailsFetchDataSuccess(mails)))
        .catch(() => dispatch(mailsHasErrored(true)));
    }
}
  

// edit data (json-server 'PUT')
export function putData(url, id, data, actionType) {
  return (dispatch) => {
    console.log('putData called with url:', url, 'id:', id, 'data:', data, 'actionType:', actionType);
    const urlid = url + '/' + id;
    fetch(urlid, {
      method: 'put',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
      .then((mails) => {
        dispatch(mailsFetchDataSuccess(mails));
        if (actionType) {
          dispatch({ type: actionType, id });
        }
      })
      .catch(() => dispatch(mailsHasErrored(true)));
  }
}
// a function that only changes the state that is stored in redux store. 
export const TOGGLE_READ_STATUS = 'TOGGLE_READ_STATUS'; 

export const toggleReadStatus = (id) => ({
  type: TOGGLE_READ_STATUS,
  id
});

function timeFormat(time){
    const timepart = time.toTimeString().split(' ')[0]
    const datepart = time.toLocaleDateString().split('/').join('-')

    return `${datepart} ${timepart}`
}