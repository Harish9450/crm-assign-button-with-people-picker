/* tslint:disable */
import * as React from 'react';
/* tslint:enable */
import {
    BaseComponent,
    assign
} from 'office-ui-fabric-react/lib/Utilities';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import { IPersonaProps, Persona } from 'office-ui-fabric-react/lib/Persona';
import {
    CompactPeoplePicker,
    IBasePickerSuggestionsProps,
    IBasePicker,
    ListPeoplePicker,
    NormalPeoplePicker,
    ValidationState
} from 'office-ui-fabric-react/lib/Pickers';
import { PrimaryButton, IButtonProps, CommandBarButton } from 'office-ui-fabric-react/lib/Button';
import { IPersonaWithMenu } from 'office-ui-fabric-react/lib/components/pickers/PeoplePicker/PeoplePickerItems/PeoplePickerItem.types';
import { people, mru } from './my-people-picker-data';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Promise } from 'es6-promise';
import './PeoplePicker.Types.Example.scss';
import { Redirect } from "react-router-dom";
import { PeopleApi } from './my-people-picker-data';
import { PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { TestImages } from 'office-ui-fabric-react/lib/common/TestImages';
import { CdsApiClient, ITokenAuthentication } from '../../../shared/services/temp/CdsApiClient';
import { HostingEnvironment } from "../../../shared/services/temp/HostingEnvironment";
import { auth } from "../../../shared/tokenConfig";

export class MyCustomePickerControl extends React.Component<{}, {
    delayResults?: boolean;
    peopleList: IPersonaProps[];
    mostRecentlyUsed: IPersonaProps[];
    currentSelectedItems?: IPersonaProps[];
}>{
    constructor(props) {
        super(props);
        const peopleList: IPersonaWithMenu[] = [];
        // people.forEach((persona: IPersonaProps) => {
        //     const target: IPersonaWithMenu = {};

        //     assign(target, persona);
        //     peopleList.push(target);
        // });
        this.state = {
            delayResults: false,
            peopleList: peopleList,
            mostRecentlyUsed: mru,
            currentSelectedItems: []
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
            peopleList: _persons
        });
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
    render() {
        return (
            <div>
                <NormalPeoplePicker
                    onResolveSuggestions={this._onFilterChanged}
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
                    removeButtonAriaLabel={'Remove'}
                    inputProps={{
                        onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
                        onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called'),
                        'aria-label': 'People Picker'
                    }}
                    // componentRef={this._resolveRef('_picker')}
                    onInputChange={this._onInputChange}
                    resolveDelay={300}
                />
            </div>
        );
    }
}
export default MyCustomePickerControl;
