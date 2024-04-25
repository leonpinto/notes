const Note = require('../models/Notes');
const mongoose = require('mongoose');

const dashboardLayout = "../views/layouts/dashboard";


exports.dashboard = async (req, res) => {

    let perPage = 8;
    let page = req.query.page || 1;

    const locals = {
        title : "Dashboard",
        description : "NodeJS App"
    }

    try {
        const notes = await Note.aggregate([
            {
                $sort: {
                    createdAt: -1,
                }
            },
            {
                $match: {
                    user : new mongoose.Types.ObjectId(req.user.id)
                }
            },
            {
                $project: {
                    title: {
                        $substr: ['$title', 0, 35]
                    },
                    body: {
                        $substr: ['$body', 0, 100]
                    }
                }
            }
        ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Note.count().where({ user : req.user.id });

        res.render('dashboard/index', {
            userName: req.user.firstName,
            locals,
            notes,
            layout: dashboardLayout,
            currentPage: page,
            pages: Math.ceil(count / perPage)
        });
    
    } catch (error) {
        console.log(error);
        res.redirect('/dashboard')
    }
}


exports.dashboardViewNote = async (req, res) => {
    const note = await Note.findById( { _id : req.params.id } )
    .where({ user : req.user.id }).lean();

    if (note) {
        res.render('dashboard/view-note', {
            noteId : req.params.id,
            note,
            layout: dashboardLayout
        })
    } else {
        res.send("Something went wrong...")
    }
}


exports.dashboardUpdateNote = async (req, res) => {
    try {
        await Note.findOneAndUpdate(
            { _id: req.params.id },
            { title : req.body.title, body : req.body.body }
        ).where( { user : req.user.id } )

        res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
    }
}

exports.dashboardDeleteNote = async (req, res) => {
    try {
        await Note.findOneAndDelete(
            { _id: req.params.id }
        ).where( { user : req.user.id } )

        res.redirect('/dashboard')
        
    } catch (error) {
        console.log(error)
    }
}

exports.dashboardAddNote = async (req, res) => {

    res.render('dashboard/add', {
        layout : dashboardLayout
    });
}


exports.dashboardAddNoteSubmit = async (req, res) => {
    try {

        req.body.user = req.user.id;

        await Note.create(req.body);

        res.redirect('/dashboard')

    } catch (error) {
        console.log(error);
    }
}

exports.dashboardSearch = async (req, res) => {
    try {
        res.render('/dashboard/search', {
            searchResults : '',
            layout: dashboardLayout
        })
    } catch (error) {
        console.log(error)
    }
}

exports.dashboardSearchSubmit = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        const searchSanitized = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

        const searchResults = await Note.find({
            $or : [
                { title : { $regex : new RegExp(searchSanitized, 'i')}},
                { body : { $regex : new RegExp(searchSanitized, 'i')}}
            ]
        }).where({user: req.user.id})

        res.render('dashboard/search', {
            searchResults,
            layout : dashboardLayout
        })

    } catch (error) {
        console.log(error)
    }
}