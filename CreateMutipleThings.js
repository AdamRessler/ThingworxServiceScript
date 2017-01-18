// Assume Input Parameter named inParamThingName to the service
try {
// Create all things in dependant order
//If any exception occurs attempt to roll back each in the catch
    var params = {
        thingTemplateName: "GenericThing",
        description: inParamThingName,
        name: inParamThingName
    };
    Resources["EntityServices"].CreateThing(params);

    Things[inParamThingName].EnableThing();
    Things[inParamThingName].RestartThing();

    var params = {
        topOUName: inParamThingName,
        description: inParamThingName,
        name: inParamThingName,
        topOUDescription: inParamThingName
    };
    Resources["EntityServices"].CreateOrganization(params);

    var params = {
        principal: inParamThingName,
        principalType: "Organization"
    };
    Things[inParamThingName].AddVisibilityPermission(params);

    var params = {
        description: inParamThingName + " Network",
        name: inParamThingName + "Network",
        connections: undefined
    };
    Resources["EntityServices"].CreateNetwork(params);

    var params = {
        to: inParamThingName,
        connectionType: "Contains",
        from: ""
    };
    Networks[inParamThingName + "Network"].AddConnection(params);

} catch (err2) {
    try {
        var params = {
            name: inParamThingName + "Network"
        };
        Resources["EntityServices"].DeleteNetwork(params);
    } catch (err3) {} //Ignore fail since the thing likely was not created go to next
    try {
        var params = {
            name: inParamThingName
        };
        Resources["EntityServices"].DeletOrganization(params);
    } catch (err3) {}//Ignore fail since the thing likely was not created go to next
    try {
        var params = {
            name: CompanyName
        };
        Resources["EntityServices"].DeleteThing(params);
    } catch (err3) {}//Ignore fail since the thing likely was not created
    logger.error(err2);
    //Log or throw original exception
}