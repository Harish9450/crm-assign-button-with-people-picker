import * as React from 'react';
import { BrowserRouter as Router, Link, Route, Redirect } from "react-router-dom";
import { ContactEntityList } from "./../src/components/MetadataList/examples/contact-entity-list";
import { ContactEntityFormDetails } from "./../src/components/MetadataList/examples/contact-entity-form";
import { PeoplePickerTypesExample} from "./../src/components/MetadataList/examples/custome-people-picker";
import { DefaultButton, IButtonProps, CommandBarButton } from 'office-ui-fabric-react/lib/Button';
import { initializeIcons } from '@uifabric/icons';
import { Nav, INavProps } from 'office-ui-fabric-react/lib/Nav';
import { DialogLargeHeaderExample } from "./components/MetadataList/examples/CustomeDialog"
import 'office-ui-fabric-core/dist/css/fabric.min.css';
import { MyCustomePickerControl } from './components/MetadataList/examples/my-people-picker'
export class App extends React.Component {
  constructor(props) {
    super(props);
    initializeIcons();
  }
  
  public render() {
    return (
      <Router>
        <div className="ms-Grid">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm12 ms-md3 ms-lg3">
              <div className='ms-NavExample-LeftPane'>
                <Nav groups={
                  [
                    {
                      links:
                        [
                          {
                            name: 'Contact Entity List',
                            url: '/list',
                            //icon: 'BulletedList',
                            key: 'key8'
                          },
                          {
                            name: 'MDD Dialog',
                            url: '/dialog',
                            key: 'key10'
                          },
                          {
                            name: 'Picker',
                            url: '/picker',
                            key: 'key11'
                          },
                          {
                            name: 'My Picker',
                            url: '/my-people-picker',
                            key: 'key12'
                          }
                        ]
                    }
                  ]
                }
                  expandedStateText={'expanded'}
                  collapsedStateText={'collapsed'}
                  selectedKey={'key3'}
                />
              </div>
            </div>
            <div className="ms-Grid-col ms-sm12 ms-md9 ms-lg9">
              <Route path="/list" exact={true} strict={true} component={ContactEntityList} />
              <Route path="/new" exact={true} strict={true} component={ContactEntityFormDetails} />
              <Route path="/dialog" exact={true} strict={true} component={DialogLargeHeaderExample} />
              <Route path="/picker" exact={true} strict={true} component={PeoplePickerTypesExample} />
              <Route path="/my-people-picker" exact={true} strict={true} component={MyCustomePickerControl} />
            </div>
          </div>
        </div>
      </Router>
    );
  }
}
export default App;
