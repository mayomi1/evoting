/**
 * Created by mayomi on 7/6/17.
 */
module.exports = {
    // Secret key for JWT signing and encryption
    'secret': 'thljnlbklk5t9',
    // Database connection information
    'database': 'mongodb://localhost:27017/evoting',
    // Setting port for server
    'port': process.env.PORT || 3000
};
