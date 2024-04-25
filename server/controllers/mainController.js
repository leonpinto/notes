exports.homepage = async (req, res) => {
    const locals = {
        title : "Node",
        description : "NodeJS App"
    }

    res.render('index', {
        locals
    });
}

exports.about = async (req, res) => {
    const locals = {
        title : "About - Node",
        description : "NodeJS App"
    }

    res.render('about', {
        locals,
        layout: '../views/layouts/front-page'
    });
}