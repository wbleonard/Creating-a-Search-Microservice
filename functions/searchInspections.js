// This function is the endpoint's request handler.
exports = function({ query, headers, body}, response) {
    // Data can be extracted from the request as follows:
    
    // A default value for testing from this console if searchTerm is not defined.
    var searchTerm = "Fail"
    
    if (query != undefined)
      if (query.searchTerm != undefined)
        searchTerm = query.searchTerm;

    console.log("searchTerm: ", searchTerm);

    var inspectinsCollection = context.services.get("mongodb-atlas").db("sample_training").collection("inspections");
    
    const pipeline = [{$search: {
       index: 'default',
       text: {
        query: searchTerm,
        path: {
         wildcard: '*'
        }
       }
      }}, {$addFields: {
       score: {
        $meta: 'searchScore'
       }
      }}, {
        $limit: 10
      }]
    
    
    return inspectinsCollection.aggregate(pipeline).toArray()
      .then(inspections => {
        console.log(`Successfully searched inspections for ${searchTerm}.`)
        for(const inspection of inspections) {
          console.log(`business_name: ${inspection.business_name}`)
        }
        return inspections
      })
      .catch(err => console.error(`Failed to search inspections: ${err}`))
  
};
