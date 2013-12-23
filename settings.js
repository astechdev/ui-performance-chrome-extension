var url = 'https://wdw-stage.disney.go.com/';
//var url = 'https://wdprolt02.disney.go.com/';
//var url = 'https://disneyworld.disney.go.com/';

var repetitions = 30;

var pages = [
    {
        page: 'resorts/',
        description: 'resorts xup=false pre-avail',
        cookies: []
    },
    {
        page: 'resorts/',
        description: 'resorts xup=false post-avail',
        cookies: [
            {
                url: url,
                name: 'roomForm_jar',
                value: encodeURI('{"checkInDate":"2014-02-01","checkOutDate":"2014-02-07","numberOfAdults":"2","numberOfChildren":"0","accessible":"0"}'),
                path: '/'
            }
        ]
    },
    {
        page: 'resorts/',
        description: 'resorts xup=true pre-avail',
        cookies: [
            {
                url: url,
                name: 'enableLodgingXUp',
                value: encodeURI('{"enableLodgingXUp":true}'),
                path: '/'
            }
        ]
    },
    {
        page: 'resorts/',
        description: 'resorts xup=true post-avail',
        cookies: [
            {
                url: url,
                name: 'enableLodgingXUp',
                value: encodeURI('{"enableLodgingXUp":true}'),
                path: '/'
            },{
                url: url,
                name: 'roomForm_jar',
                value: encodeURI('{"checkInDate":"2014-02-01","checkOutDate":"2014-02-07","numberOfAdults":"2","numberOfChildren":"0","accessible":"0","resort":""}'),
                path: '/'
            }
        ]
    },
    {
        page: 'resorts/animal-kingdom-lodge/rates-rooms/',
        description: 'ak lodge xup=false pre-avail',
        cookies: []
    },
    {
        page: 'resorts/animal-kingdom-lodge/rates-rooms/',
        description: 'ak lodge xup=false post-avail',
        cookies: [
            {
                url: url,
                name: 'roomForm_jar',
                value: encodeURI('{"checkInDate":"2014-02-01","checkOutDate":"2014-02-07","numberOfAdults":"2","numberOfChildren":"0","accessible":"0"}'),
                path: '/'
            }
        ]
    },
    {
        page: 'resorts/animal-kingdom-lodge/rates-rooms/',
        description: 'ak lodge xup=true pre-avail',
        cookies: [
            {
                url: url,
                name: 'enableLodgingXUp',
                value: encodeURI('{"enableLodgingXUp":true}'),
                path: '/'
            }
        ]
    },
    {
        page: 'resorts/animal-kingdom-lodge/rates-rooms/',
        description: 'ak lodge xup=true post-avail',
        cookies: [
            {
                url: url,
                name: 'enableLodgingXUp',
                value: encodeURI('{"enableLodgingXUp":true}'),
                path: '/'
            },{
                url: url,
                name: 'roomForm_jar',
                value: encodeURI('{"checkInDate":"2014-02-01","checkOutDate":"2014-02-07","numberOfAdults":"2","numberOfChildren":"0","accessible":"0","resort":"80010395;entityType=resort"}'),
                path: '/'
            }
        ]
    }
];