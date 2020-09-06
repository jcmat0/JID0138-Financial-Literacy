// import defaultImage from 'logo192.png'
import {
  Button,
  Divider,
  Form,
  Input,
  List,
  PageHeader,
  Typography
} from 'antd'
import React, { Component } from 'react'

import { PhoneOutlined, SolutionOutlined } from '@ant-design/icons'

const { Title } = Typography
type propsType = {
  name: string
  email?: string
  phoneNumber?: string
}

// function Image() {
//   const uploadedImage = React.useRef(null)
//   const imageUploader = React.useRef(null)
//   //const defaultImage = <img src ="logo192.png" alt =""/>

//   const handleImageUpload = (e: any) => {
//     const [file] = e.target.files
//     if (file) {
//       const reader = new FileReader()

//       const { current } = uploadedImage

//       //if (current !== undefined) {
//       //current.file = file;
//       //reader.onload = e => {
//       //  current.src = e.target.result;
//       //};
//       // reader.readAsDataURL(file);
//       //}
//     }
//   }

//   return (
//     <div
//       style={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center'
//       }}
//     >
//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleImageUpload}
//         ref={imageUploader}
//         style={{
//           display: 'none'
//         }}
//       />
//       <div
//         style={{
//           height: '60px',
//           width: '60px',
//           border: '1px dashed black'
//         }}
//         //onClick={() => imageUploader.current.click()}
//       >
//         <img
//           ref={uploadedImage}
//           style={{
//             width: '100%',
//             height: '100%',
//             position: 'static'
//           }}
//           alt=""
//         />
//       </div>
//       Click to upload Image
//     </div>
//   )
// }

class Profile extends Component<propsType> {
  onSave = (val: any) => {
    console.log('Edited Value-> ', val)
  }
  onFinish = (values: any) => {
    console.log('Success:', values)
  }

  render() {
    const { name, email, phoneNumber } = this.props
    const classes = [
      'Financial Learning Curriculum',
      'Second Class Name',
      'Third Class Name'
    ]
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title={<Title> Profile </Title>}
          subTitle={name}
        />
        <List
          header={<Title level={2}> Classes </Title>}
          dataSource={classes}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
        <Divider />
        <Title level={2}> Contact Information </Title>
        <Form name="basic" onFinish={this.onFinish}>
          <Form.Item label="Phone Number: " name="phoneNumber">
            <Input prefix={<PhoneOutlined />} placeholder={phoneNumber} />
          </Form.Item>

          <Form.Item label="Email: " name="email">
            <Input prefix={<SolutionOutlined />} placeholder={email} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Profile
