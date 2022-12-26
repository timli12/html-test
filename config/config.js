const config = {
    app: {
        port: process.env.PORT || 3000
    },
    db:{
        url: "mongodb+srv://timli123:<password>@cluster0.6qoiglc.mongodb.net/?retryWrites=true&w=majority"
    }
};
module.exports = config;