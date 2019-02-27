// Created by Kamen SHah

var cheerio = require('cheerio');
var axios = require('axios');
var util = require('util')

var WEXurl = "https://www.sourcewell-mn.gov/cooperative-purchasing/022217-wex";
getHTML(WEXurl);


// Use axios Library to retrieve html from webpage
function getHTML(url){
    axios.get(url).then(response => {
        parseHTML(response.data);
    }).catch(error => {
    console.log(error); 
    });
}

//Function that generates JSON object using Cheerio Library to parse HTML
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

        // Get links to all documents on webpage
        $('.file-link').each(function(i, element){
            var link = $(this).children().attr('href');
            var linkName = $(this).children().text();
            links.push({linkName,link});

        });

        // Get user data for all users 
        $('.inline-user').each(function(i, element){
            var user = $(this).text().replace(/^\s*\n/gm, '').split('\n');
            var name = user[0].trim();
            var phone = user[1].trim().replace("Phone:","");
            var email = user[2].trim().replace("Email:","");
            if (! contacts.filter(e => e.name === name).length > 0) {
                contacts.push({name,phone,email});
              }
        });
        
        // Generate JSON Object
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

}

/*
JSON object created from script

{ title: 'Fleet GPS & Telematics',
  expiration: '06/01/2021',
  contract_number: '#022217-WEX',
  files: 
   [ { linkName: 'Request for Proposal (RFP)',
       link: 'https://www.sourcewell-mn.gov/sites/default/files/2018-05/Fleet%20Management%20%20RFP%20022217_5.pdf' },
     { linkName: 'Contract Forms ',
       link: 'https://www.sourcewell-mn.gov/sites/default/files/2018-05/WEX%20Contract%20022217.pdf' },
     { linkName: 'Contract Acceptance & Award',
       link: 'https://www.sourcewell-mn.gov/sites/default/files/2018-05/Acceptance%20and%20Award-WEX%20022217.pdf' },
     { linkName: 'Affidavit of Advertisement',
       link: 'https://www.sourcewell-mn.gov/sites/default/files/2018-05/Combined%20Ads-Fleet%20Management%20022217_6.pdf' },
     { linkName: 'Proposal Opening Witness Page',
       link: 'https://www.sourcewell-mn.gov/sites/default/files/2018-05/Proposal%20Opening%20Witness-Fleet%20Management%20022217_5.pdf' },
     { linkName: 'Proposal Evaluation',
       link: 'https://www.sourcewell-mn.gov/sites/default/files/2018-05/Form%20G%20Evaluation-Fleet%20Management%20022217_5.pdf' },
     { linkName: 'Evaluation Committee Comment & Review',
       link: 'https://www.sourcewell-mn.gov/sites/default/files/2018-05/Comment%20and%20Review-Fleet%20Management%20022217_5.pdf' },
     { linkName: 'Board Minutes',
       link: 'https://www.sourcewell-mn.gov/sites/default/files/2018-05/Board%20Minutes%206-20-17_7.pdf' } ],
  vendor: 
   { name: 'WEX',
     contacts: 
      [ { name: 'Denise Baumgart',
          phone: '888-842-0075',
          email: ' denise.baumgart@wexinc.com' },
        { name: 'Kelly McAllister, Contract Administration Supervisor',
          phone: '218-894-5468',
          email: 'kelly.mcallister@sourcewell-mn.gov' },
        { name: 'Kim Wudinich, Contract Administration Specialist',
          phone: '218-894-5485',
          email: 'kim.wudinich@sourcewell-mn.gov' } 
      ]
    } 
}


*/