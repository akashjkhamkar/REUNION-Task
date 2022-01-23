const data = [
    {
        name: 'pim',
        email: 'pim@smiling.com',
        password: 'pim'
    },
    {
        name: 'rick',
        email: 'rick@morty.com',
        password: 'rick'
    },
    {
        name: 'dipper',
        email: 'dipper@gravity.com',
        password: 'dipper'
    },
    {
        name: 'jake',
        email: 'jake@adventure.com',
        password: 'jake'
    },
    {
        name: 'finn',
        email: 'finn@adventure.com',
        password: 'pim'
    }  
]

const posts = [
    {
        title: 'guide to the dave land',
        description: 'visit the daveland to enjoy the dave rides, dave ice creams, dave waterparks and meet the dave himself ',
        userid: 8
    },
    {
        title: 'oregon travel guide',
        description: 'dipper pines showing you the best travel locations in the oregon',
        userid: 10
    },
    {
        title: 'tree house building 101',
        description: 'notes by finn, home edition',
        userid: 12
    }
]


// data.forEach(profile => {
//     bcrypt.hash(profile.password, saltRounds, function(err, hash) {
//         pool.query('INSERT INTO users(name, email, password) values($1, $2, $3);'
//         , [profile.name, profile.email, hash]);
//     });
// })
