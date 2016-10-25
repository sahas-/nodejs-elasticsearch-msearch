import elasticsearch from 'elasticsearch';
import Q from 'q';
import _ from 'underscore';
import config from './config.json';

function msearch() {
    let input = ["chicagi", "auston", "denvor", "newark", "san burno", "new", "chicagi"];
    let index = { "index": config.elasticsearch.index };
    let query = [];
    let _uniq = _.uniq(input);

    _uniq.forEach((item) => {
        let _query =
            {
                "size": 1,
                "query": {
                    "match": {
                        "name": {
                            "query": item,
                            "fuzziness": 1
                        }
                    }
                }
            };
        query.push(index);
        query.push(_query);
    });

    let elasticClient = new elasticsearch.Client({
        host: config.elasticsearch.host,
        requestTimeout: 50000,
        keepAlive: true,
        retry: 10
    });
    elasticClient.msearch({
        body: query
    })
    .then((response)=>{
        let responses = response.responses;
        responses.forEach((res)=>{
            if(res.hits.total) console.log(res.hits.hits[0]._source.name);
        })
    })
    .catch((error)=>{
        console.error(error);
    });


}
msearch();