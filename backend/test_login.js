const authController = require('./controllers/authController');

const req = {
    body: {
        email: 'superadmin@logbook.com',
        password: 'superadmin1'
    }
};

const res = {
    status: function (code) {
        this.statusCode = code;
        return this;
    },
    json: function (data) {
        console.log('Response Code:', this.statusCode);
        console.log('Response Data:', JSON.stringify(data));
    }
};

authController.login(req, res);
