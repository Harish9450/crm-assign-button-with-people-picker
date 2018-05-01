import { boolean, select } from "@storybook/addon-knobs/react";
import * as React from "react";
import { MockXrmApiClient } from "../../../shared/services/MockXrmApiClient";
import { MetadataList } from "./../MetadataList";
import { auth } from "../../../shared/tokenConfig";
import { CdsApiClient, ITokenAuthentication } from "../../../shared/services/temp/CdsApiClient";
import { HostingEnvironment } from "../../../shared/services/temp/HostingEnvironment";
import { DefaultButton, PrimaryButton, IButtonProps, CommandBarButton } from 'office-ui-fabric-react/lib/Button';
import { BrowserRouter as Router, Link, Route, Redirect } from "react-router-dom";
import { store } from "../../../shared/store";
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { ChoiceGroup } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Dropdown } from 'office-ui-fabric-react/lib/Dropdown';
import * as Entities from '../../../shared/services/temp/Contracts/Entity';
import {
    BaseComponent,
    assign
} from 'office-ui-fabric-react/lib/Utilities';
import {
    CompactPeoplePicker,
    IBasePickerSuggestionsProps,
    IBasePicker,
    ListPeoplePicker,
    NormalPeoplePicker,
    ValidationState
} from 'office-ui-fabric-react/lib/Pickers';
import { IPersonaProps, Persona } from 'office-ui-fabric-react/lib/Persona';
import { people, mru } from './people-picker-data';
import { PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { TestImages } from 'office-ui-fabric-react/lib/common/TestImages';
import { IPersonaWithMenu } from 'office-ui-fabric-react/lib/components/pickers/PeoplePicker/PeoplePickerItems/PeoplePickerItem.types';
// import { Modal } from 'react-modal';
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};
export class ContactEntityDisplay extends React.Component<{}, {
    hideDialog: boolean;
    ShowAssign?: boolean;
    hideTeam: boolean;
    sysuserid?: string;
    options: any[],
    currentSelectedItems?: IPersonaProps[];
    isEditForm: boolean;
    peopleList: IPersonaProps[];
    delayResults?: boolean;
    mostRecentlyUsed: IPersonaProps[];
    disableDialogAssign: boolean;
}> {
    constructor(props) {
        super(props);
        const peopleList: IPersonaWithMenu[] = [];
        const mru: IPersonaProps[] = [];
        this.state = {
            ShowAssign: store.getState().SelectedRowsCount > 0 ? false : true,
            hideDialog: true,
            options: [{ key: "", text: "" }],
            hideTeam: true,
            isEditForm: false,
            peopleList: peopleList,
            delayResults: false,
            mostRecentlyUsed: mru,
            currentSelectedItems: [],
            disableDialogAssign: false
        };
    }

    componentDidMount() {
        this.FetchTeamsAndUsers();
    }
    public FetchTeamsAndUsers = () => {
        const xrmApiClient = new CdsApiClient(auth, null, HostingEnvironment.TESTING);
        var endpoint: string = "systemusers";
        var select: string = "systemuserid,fullname,address1_telephone1,businessunitid,siteid,title,internalemailaddress,address1_fax,positionid";
        var filter: string = "accessmode ne 3 and isdisabled eq false and accessmode ne 5";
        var orderby: string = "fullname asc";
        const dataPromise = xrmApiClient.fetchUserListAsync(endpoint, select, filter, orderby)
        var _persons: (IPersonaProps & { key: string | number | any })[] = [];
        Promise.all([dataPromise]).then(values => {
            for (var i = 0; i < values[0].length; i++) {
                // _persons.push({ key: values[0][i].systemuserid, text: values[0][i].fullname });
                _persons.push({
                    key: values[0][i].systemuserid,
                    imageUrl: TestImages.personaMale,
                    imageInitials: 'PV',
                    primaryText: values[0][i].fullname,
                    secondaryText: 'Software Engineer',
                    tertiaryText: 'In a meeting',
                    optionalText: 'Available at 4:00pm',
                    presence: PersonaPresence.online
                });
            }
        });
        endpoint = "teams";
        select = null;
        filter = null;
        orderby = null;
        const dataPromise1 = xrmApiClient.fetchUserListAsync(endpoint, select, filter, orderby)
        Promise.all([dataPromise1]).then(values => {
            for (var i = 0; i < values[0].length; i++) {
                // _user.push({ key: values[0][i].teamid, text: values[0][i].name });
                _persons.push({
                    key: values[0][i].teamid,
                    imageUrl: TestImages.personaFemale,
                    imageInitials: 'PV',
                    primaryText: values[0][i].name,
                    secondaryText: 'Software Engineer',
                    tertiaryText: 'In a meeting',
                    optionalText: 'Available at 4:00pm',
                    presence: PersonaPresence.busy
                });
            }
        });
        this.setState({
            peopleList: _persons,
            mostRecentlyUsed: _persons.slice(0, 5)
        });
    }
    private _showDialog = (): void => {
        this.setState({ hideDialog: false });
    }

    private _closeDialog = (): void => {
        this.setState({ hideDialog: true });
    }

    private _onChoiceChanged() {
        console.log('Choice option change');
    }
    private _onChangeUser = (text: any) => {
        this.setState({ sysuserid: text });
    }
    private _onChangeAssignto = (text: any) => {
        if (text == "B") {
            const xrmApiClient = new CdsApiClient(auth, null, HostingEnvironment.TESTING);
            var endpoint: string = "systemusers";
            var select: string = "systemuserid,fullname,address1_telephone1,businessunitid,siteid,title,internalemailaddress,address1_fax,positionid";
            var filter: string = "accessmode ne 3 and isdisabled eq false and accessmode ne 5";
            var orderby: string = "fullname asc";
            const dataPromise = xrmApiClient.fetchUserListAsync(endpoint, select, filter, orderby)
            var _user: any[] = [];
            Promise.all([dataPromise]).then(values => {
                for (var i = 0; i < values[0].length; i++) {
                    _user.push({ key: values[0][i].systemuserid, text: values[0][i].fullname });
                }
            });
            endpoint = "teams";
            select = null;
            filter = null;
            orderby = null;
            const dataPromise1 = xrmApiClient.fetchUserListAsync(endpoint, select, filter, orderby)
            Promise.all([dataPromise1]).then(values => {
                for (var i = 0; i < values[0].length; i++) {
                    _user.push({ key: values[0][i].teamid, text: values[0][i].name });
                }
            });
            this.setState({
                options: _user,
                hideTeam: false,
                disableDialogAssign: true
            });
        }
        else if (text == "A") {
            this.setState({
                sysuserid: "6fb6e6f3-9a43-e811-a959-000d3a37d076",
                hideTeam: true,
                disableDialogAssign: false
            });
        }
    }
    AssignContact = () => {
        const xrmApiClient = new CdsApiClient(auth, null, HostingEnvironment.TESTING);
        var list = store.getState().contactList;
        var count = 0;
        for (var i = 0; i < list.length; i++) {
            var params = {
                "Target": {
                    "@odata.type": "Microsoft.Dynamics.CRM.contact",
                    "contactid": list[i].contactid // "f50fca94-eb44-e811-a959-000d3a365e68"
                },
                "Assignee": {
                    "@odata.type": "Microsoft.Dynamics.CRM.systemuser",
                    "systemuserid": this.state.sysuserid //"6fb6e6f3-9a43-e811-a959-000d3a37d076"
                }
            }
            var newParams: string = JSON.stringify(params);
            let responce: Promise<Boolean> = xrmApiClient.Assign(newParams);
            if (responce) {
                count++;
            }
        }
        if (count > 0) {
            alert("Assigned successfully !!!");
            this._closeDialog();
        }
        else {
            alert("Error in action, Please try again later !!!");
        }
    }
    public onStateChanged = () => {
        this.setState({ ShowAssign: store.getState().SelectedRowsCount > 0 ? false : true, });
    }
    private _onClicktoNavigate = () => {
        this.setState({ isEditForm: true });
    }
    private _onFilterChanged = (filterText: string, currentPersonas: IPersonaProps[], limitResults?: number): IPersonaProps[] | Promise<IPersonaProps[]> => {
        if (filterText) {
            let filteredPersonas: IPersonaProps[] = this._filterPersonasByText(filterText);

            filteredPersonas = this._removeDuplicates(filteredPersonas, currentPersonas);
            filteredPersonas = limitResults ? filteredPersonas.splice(0, limitResults) : filteredPersonas;
            return this._filterPromise(filteredPersonas);
        } else {
            return [];
        }
    }
    private _filterPromise(personasToReturn: IPersonaProps[]): IPersonaProps[] | Promise<IPersonaProps[]> {
        if (this.state.delayResults) {
            return this._convertResultsToPromise(personasToReturn);
        } else {
            return personasToReturn;
        }
    }
    private _convertResultsToPromise(results: IPersonaProps[]): Promise<IPersonaProps[]> {
        return new Promise<IPersonaProps[]>((resolve, reject) => setTimeout(() => resolve(results), 2000));
    }
    private _listContainsPersona(persona: IPersonaProps, personas: IPersonaProps[]) {
        if (!personas || !personas.length || personas.length === 0) {
            return false;
        }
        return personas.filter(item => item.primaryText === persona.primaryText).length > 0;
    }
    private _doesTextStartWith(text: string, filterText: string): boolean {
        return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
    }

    private _removeDuplicates(personas: IPersonaProps[], possibleDupes: IPersonaProps[]) {
        return personas.filter(persona => !this._listContainsPersona(persona, possibleDupes));
    }
    private _filterPersonasByText(filterText: string): IPersonaProps[] {
        return this.state.peopleList.filter(item => this._doesTextStartWith(item.primaryText as string, filterText));
    }
    private _onInputChange(input: string): string {
        const outlookRegEx = /<.*>/g;
        const emailAddress = outlookRegEx.exec(input);

        if (emailAddress && emailAddress[0]) {
            return emailAddress[0].substring(1, emailAddress[0].length - 1);
        }

        return input;
    }
    private _onItemsChange = (items: any[]): void => {
        this.setState({
            currentSelectedItems: items,
            disableDialogAssign: items.length > 0 ? false : true,
            sysuserid: items.length > 0 ? items[0].key : ""
        });
    }
    private _returnMostRecentlyUsed = (currentPersonas: IPersonaProps[]): IPersonaProps[] | Promise<IPersonaProps[]> => {
        let { mostRecentlyUsed } = this.state;
        mostRecentlyUsed = this._removeDuplicates(mostRecentlyUsed, currentPersonas);
        return this._filterPromise(mostRecentlyUsed);
    }
    public render() {
        const xrmApiClient = new CdsApiClient(auth, null, HostingEnvironment.TESTING);
        if (this.state.isEditForm) {
            return (<Redirect to="/new" />);
        }
        else {
            return (
                <div>
                    <div>
                        <Dialog
                            hidden={this.state.hideDialog}
                            onDismiss={this._closeDialog}
                            dialogContentProps={{
                                type: DialogType.largeHeader,
                                title: 'Assign Contact',
                                subText: 'You have selected 1 Contact. To whom would you like to assign it?'
                            }}
                            modalProps={{
                                isBlocking: false,
                                containerClassName: 'ms-dialogMainOverride'
                            }}
                        >
                            <div className='docs-DropdownExample'>
                                <Dropdown
                                    label='Assign to:'
                                    required={true}
                                    id='Customdrop2'
                                    ariaLabel='Me and User'
                                    onChanged={e => this._onChangeAssignto(e.key)}
                                    defaultSelectedKey="A"
                                    options={
                                        [
                                            { key: 'A', text: 'Me', data: { icon: 'Memo' }, },
                                            { key: 'B', text: 'User or Team', data: { icon: 'Print' } },
                                        ]
                                    }
                                />
                                <div>
                                    <label>User or Team</label><br />
                                    <NormalPeoplePicker
                                        onResolveSuggestions={this._onFilterChanged}
                                        onEmptyInputFocus={this._returnMostRecentlyUsed}
                                        // getTextFromItem={ this._getTextFromItem }
                                        pickerSuggestionsProps={{
                                            suggestionsHeaderText: 'Suggested People',
                                            mostRecentlyUsedHeaderText: 'Suggested Contacts',
                                            noResultsFoundText: 'No results found',
                                            loadingText: 'Loading',
                                            showRemoveButtons: true,
                                            suggestionsAvailableAlertText: 'People Picker Suggestions available',
                                            suggestionsContainerAriaLabel: 'Suggested contacts'
                                        }}
                                        className={'ms-PeoplePicker'}
                                        key={'normal'}
                                        onChange={this._onItemsChange}
                                        removeButtonAriaLabel={'Remove'}
                                        inputProps={{
                                            onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
                                            onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called'),
                                            'aria-label': 'People Picker'
                                        }}
                                        onInputChange={this._onInputChange}
                                        resolveDelay={300}
                                        disabled={this.state.hideTeam}
                                    />
                                </div>
                                <Dropdown
                                    placeHolder='Select an Option'
                                    label='User or Team:'
                                    id='Customdrop1'
                                    ariaLabel='User or Team'
                                    // disabled={this.state.hideTeam}
                                    disabled={true}
                                    options={this.state.options}
                                    onChanged={e => this._onChangeUser(e.key)}
                                />

                            </div>
                            <DialogFooter>
                                <PrimaryButton onClick={this.AssignContact} disabled={this.state.disableDialogAssign} text='Assign' />
                                <DefaultButton onClick={this._closeDialog} text='Cancel' />
                            </DialogFooter>
                        </Dialog>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'stretch', height: '35px' }}>
                        <CommandBarButton
                            data-automation-id='test2'
                            iconProps={{ iconName: 'Add' }}
                            text='New'
                            onClick={this._onClicktoNavigate}
                        />
                        <CommandBarButton
                            data-automation-id='test2'
                            iconProps={{ iconName: 'Assign' }}
                            text='Assign'
                            disabled={this.state.ShowAssign}
                            onClick={this._showDialog}
                        />
                        <CommandBarButton
                            data-automation-id='test2'
                            iconProps={{ iconName: 'ActivateOrders' }}
                            text='Activate'
                        />
                        <CommandBarButton
                            data-automation-id='test2'
                            iconProps={{ iconName: 'DeactivateOrders' }}
                            text='Deactivate'
                        />
                        <CommandBarButton
                            data-automation-id='test2'
                            iconProps={{ iconName: 'System' }}
                            text='System View'
                        />
                        <CommandBarButton
                            data-automation-id='test2'
                            iconProps={{ iconName: 'View' }}
                            text='View'
                        />
                    </div>
                    <div>
                        <MetadataList componentType="Contact" xrmApiClient={xrmApiClient} onStateChanged={item => this.onStateChanged()} />
                    </div>
                </div>
            );
        }
    }
}

