import * as React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import * as routes from '../../constants/routes'
import { firebase } from '../../firebase'
import { withAuthentication } from '../../firebase/withAuthentication'
import { Account } from '../Account'
import { Home } from '../Home'
import { Landing } from '../Landing'
import { PasswordForget } from '../PasswordForget'
import { SignIn } from '../SignIn'
import { SignUp } from '../SignUp'
import { Navigation } from '../Navigation/Navigation'
import { Layout, Menu } from 'antd'
import Profile from '../profile/Profile'

const { Header, Content, Footer } = Layout

class AppComponent extends React.Component {
  constructor(props: any) {
    super(props)

    this.state = {
      authUser: null
    }
  }

  public componentDidMount() {
    firebase.auth.onAuthStateChanged((authUser) => {
      authUser
        ? this.setState(() => ({ authUser }))
        : this.setState(() => ({ authUser: null }))
    })
  }

  public render() {
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
            <Menu.Item key="1">nav 1</Menu.Item>
            <Menu.Item key="2">nav 2</Menu.Item>
            <Menu.Item key="3">nav 3</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Profile
            name="Bob Smith"
            email="bob3@gatech.edu"
            phoneNumber="123-456-7890"
          />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Cents of Unity Fall 2020
        </Footer>
      </Layout>
      // <BrowserRouter>
      //   <Layout className="layout">
      //     <Header>
      //       <div className="logo" />
      //       <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
      //         <Menu.Item key="1">nav 1</Menu.Item>
      //         <Menu.Item key="2">nav 2</Menu.Item>
      //         <Menu.Item key="3">nav 3</Menu.Item>
      //       </Menu>
      //     </Header>
      //     <Navigation />
      //     <Switch>
      //       <Route exact={true} path={routes.LANDING} component={Landing} />
      //       <Route exact={true} path={routes.SIGN_UP} component={SignUp} />
      //       <Route exact={true} path={routes.SIGN_IN} component={SignIn} />
      //       <Route
      //         exact={true}
      //         path={routes.PASSWORD_FORGET}
      //         component={PasswordForget}
      //       />
      //       <Route exact={true} path={routes.HOME} component={Home} />
      //       <Route exact={true} path={routes.ACCOUNT} component={Account} />
      //     </Switch>
      //   </Layout>
      // </BrowserRouter>
    )
  }
}

export const App = withAuthentication(AppComponent)
