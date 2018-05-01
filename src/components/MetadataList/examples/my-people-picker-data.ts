import { IPersonaProps, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { TestImages } from 'office-ui-fabric-react/lib/common/TestImages';
import { CdsApiClient, ITokenAuthentication } from '../../../shared/services/temp/CdsApiClient';
import { HostingEnvironment } from "../../../shared/services/temp/HostingEnvironment";
import { auth } from "../../../shared/tokenConfig";

export const people: (IPersonaProps & { key: string | number | any })[] = [
    {
        key: 1,
        imageUrl: TestImages.personaMale,
        imageInitials: 'PV',
        primaryText: 'Harish Chandra',
        secondaryText: 'Software Engineer',
        tertiaryText: 'In a meeting',
        optionalText: 'Available at 4:00pm',
        presence: PersonaPresence.online
    }
];

export const mru: IPersonaProps[] = people.slice(0, 5);

export class PeopleApi {
    public FetchTeamsAndUsers = (): (IPersonaProps & { key: string | number | any })[] => {
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
        return _persons;
    }
}
export default PeopleApi;