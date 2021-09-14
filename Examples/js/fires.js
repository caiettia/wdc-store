(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "acres",
            alias: "acres",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "city",
            alias: "city",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "county",
            alias: "county",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "lat",
            alias: "lat",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "long",
            alias: "long",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "state",
            alias: "state",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "incident_category",
            alias: "incident_category",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "cause",
            alias: "cause",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "incident_name",
            alias: "incident_name",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "perc_contained",
            alias: "perc_contained",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "location",
            dataType: tableau.dataTypeEnum.geometry
        }];

        var tableSchema = {
            id: "wildfirefeed",
            alias: "Wildfires in the US YtD",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://services3.arcgis.com/T4QMspbfLg3qTGWY/arcgis/rest/services/CY_WildlandFire_Perimeters_ToDate/FeatureServer/0/query?where=1%3D1&outFields=irwin_CalculatedAcres,irwin_FireCause,irwin_IncidentName,irwin_InitialLatitude,irwin_InitialLongitude,irwin_PercentContained,irwin_PercentPerToBeContained,irwin_IncidentShortDescription,irwin_IncidentTypeCategory,irwin_POOCity,irwin_POOCounty,irwin_POOState&outSR=4326&f=json", function(resp) {
            var feat = resp.features,
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "acres": feat[i].attributes.irwin_CalculatedAcres,
                    "city": feat[i].attributes.irwin_POOCity,
                    "county": feat[i].attributes.irwin_POOCounty,
                    "lat": feat[i].attributes.irwin_InitialLatitude,
                    "long": feat[i].attributes.irwin_InitialLongitude,
                    "state": feat[i].attributes.irwin_POOState,
                    "incident_category": feat[i].attributes.irwin_IncidentTypeCategory,
                    "cause": feat[i].attributes.irwin_FireCause,
                    "incident_name": feat[i].attributes.irwin_IncidentName,
                    "perc_contained": feat[i].attributes.irwin_PercentContained,
                    "location": feat[i].geometry
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "WFIGS Wildfire Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();