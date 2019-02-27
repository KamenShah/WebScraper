var cheerio = require('cheerio');
var axios = require('axios');
var util = require('util')

var WEXurl = "https://www.sourcewell-mn.gov/cooperative-purchasing/022217-wex";
getHTML(WEXurl);


function getHTML(url){
    axios.get(url).then(response => {
        parseHTML(response.data);
    }).catch(error => {
    console.log(error); 
    });
}

function parseHTML(html){
        var links = [];
        var contacts = [];
        const $ = cheerio.load(html);

        var header =  $('.vendor-contract-header__content');
        var name =header.children().eq(0).text();
        var title = header.children().eq(1).text();
        var contractNumber = header.children().eq(2).text().split('\n')[0];
        var expirationDate = header.children().eq(2).text().split('\n')[1];
        expirationDate = expirationDate.trim();
        expirationDate = expirationDate.split(" ")[2];

        $('.file-link').each(function(i, element){
            var link = $(this).children().attr('href');
            var linkName = $(this).children().text();
            links.push({linkName,link});

        });

        $('.inline-user').each(function(i, element){
            var user = $(this).text().replace(/^\s*\n/gm, '').split('\n');
            var name = user[0].trim();
            var phone = user[1].trim().replace("Phone:","");
            var email = user[2].trim().replace("Email:","");
            if (! contacts.filter(e => e.name === name).length > 0) {
                contacts.push({name,phone,email});
              }
        });
        
        var jsonObject = {
            title: title,
            expiration: expirationDate,
            contract_number: contractNumber,
            files: links ,
            vendor: {name: name,
                contacts: contacts      
            }
          };
        console.log(util.inspect(jsonObject, {showHidden: false, depth: null}))

        //console.log(jsonObject);

}