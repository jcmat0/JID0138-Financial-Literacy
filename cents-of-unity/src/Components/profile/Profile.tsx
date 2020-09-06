import React, { Component } from 'react'
//import { Button } from 'antd'
import ReactDOM from "react-dom";
//import '/profile.css'
import defaultImage from 'logo192.png'
import EdiText from 'react-editext'

function Image() {
  const uploadedImage = React.useRef(null);
  const imageUploader = React.useRef(null);
  //const defaultImage = <img src ="logo192.png" alt =""/>

  const handleImageUpload = (e : any) => {
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();

      const { current } = uploadedImage;
      
      //if (current !== undefined) {
      //current.file = file;
      //reader.onload = e => {
      //  current.src = e.target.result;
      //};
      // reader.readAsDataURL(file);
    //}

    }
  };

  return (  
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={imageUploader}
        style={{
          display: "none"
        }}
      />
      <div
        style={{
          height: "60px",
          width: "60px",
          border: "1px dashed black"
        }}
        //onClick={() => imageUploader.current.click()}
      >
        <img
          ref={uploadedImage}
          style={{
            width: "100%",
            height: "100%",
            position: "static"
          }}
        alt = ""/>
      </div>
      Click to upload Image

    </div>
  )
}

class Profile extends Component{

  onSave = (val: any) => {
    console.log('Edited Value-> ', val)
  }

  render() {
    return (
      <div>
  <h1> Profile for 'User'</h1>
      <p>Name: XXXX</p> 
      <p>Classes enrolled in:</p>
      <li> Financial Learning Cirriculum</li>
      <p>Contact Information:</p>
      <li>    Phone Number:  
      <EdiText
      type = 'text'
      value = 'Type your info here'
      onSave = {this.onSave}
      /></li>
      <li>    Email:  
      <EdiText
      type = 'text'
      value = 'Type your info here'
      onSave = {this.onSave}
      /></li>
      </div>
    )
  }

}

const rootElement = document.getElementById("root");
ReactDOM.render(<Profile />, rootElement);
export default Profile
