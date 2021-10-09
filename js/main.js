// Backbone Model
// const arr = [1,2,3,4,5];
// _.each(arr, alert)
let count = 1;
var Blog = Backbone.Model.extend({
    defaults: {
        author: '',
        title: '',
        url: '',
    }
})

// Backbone Collection

var Blogs = Backbone.Collection.extend({
    url: 'https://jsonplaceholder.typicode.com/users'
})

//instantiate two Blogs

var blog1 = new Blog({
    author: 'Nazar',
    title: "Nazar's blog",
    url: 'https://www.nazarsblog.com',
})

var blog2 = new Blog({
    author: 'Taras',
    title: "Taras's blog",
    url: 'https://www.tarasblog.com',
})

// instantiate a Collection

var blogs = new Blogs([blog1, blog2])
console.log(blogs.toJSON())

var BlogView = Backbone.View.extend({
    model: new Blog(),
    tagName: 'tr',
    initialize: function () {
        console.log('BlogView initialize')
        this.template = _.template($('.blog-list-template').html())
        console.log(this.template())
    },
    events: {
        'click .edit-blog': 'edit',
        'click .update-blog': 'update',
        'click .cancel-edit': 'cancelEdit',
        'click .delete-blog': 'deleteBlog',
    },
    edit: function () {
        this.$('.editing-mode').show();
        this.$('.initial-buttons').hide();

        const author = this.model.get('author');
        const title = this.model.get('title');
        const url = this.model.get('url');
        console.log(author, title, url)

        this.$('.author').html('<input type="text" class="form-control author-update" value="' + author + '">')
        this.$('.title').html('<input type="text" class="form-control title-update" value="' + title + '">')
        this.$('.url').html('<input type="text" class="form-control url-update" value="' + url + '">')
    },
    cancelEdit: function () {
        blogsView.render()
    },
    update: function () {
        const author = this.$('.author-update').val();
        const title = this.$('.title-update').val();
        const url = this.$('.url-update').val();
        if (author === this.model.get('author')
            && title === this.model.get('title')
            && url === this.model.get('url')) {
            return;
        }

        this.model.set({author, title, url})

        this.$('.initial-buttons').show();
        this.$('.editing-mode').hide();
    },
    deleteBlog: function () {
        this.model.destroy();
    },
    render: function () {
        console.log('BlogVIew render')
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
})

var BlogsView = Backbone.View.extend({
    model: blogs,
    el: $('.blogs-list'),
    initialize: function () {
        fetch(blogs.url).then(res => res.json()).then(res2 => {
            const mutation = res2.map(item => {
                return {
                    author: item.username,
                    title: item.username + "'s blog",
                    url: item.email,
                }
            })
            blogs.add(mutation)
            // res2.forEach(item => {
            //     blogs.add({
            //         author: item.username,
            //         title: item.username + "'s blog",
            //         url: item.email,
            //     })
            // })
        })
        console.log('BlogsView initialize')
        this.render();
        this.model.on('add', this.render, this);
        this.model.on('change', this.render, this);
        this.model.on('remove', this.render, this);



        // response.forEach(item => {
        //     blogs.add({
        //         author: item.username,
        //         title: item.username + "'s blog",
        //         url: item.email,
        //     })
        // })

        // this.model.fetch({
        //     success: (response) => {
        //         response.toJSON().forEach(item => {
        //             blogs.add({
        //                 author: item.username,
        //                 title: item.username + "'s blog",
        //                 url: item.email,
        //             })
        //
        //         })
        //     }
        // })
    },
    render: function () {
        console.log(count)
        count++
        console.log('BlogsVIew render')
        this.$el.html('');
        _.each(this.model.toArray(), (blog) => {
            this.$el.append((new BlogView({model: blog})).render().$el)
        })

        return this;
    }
})

var blogsView = new BlogsView();

$(document).ready(function () {
    $('.add-blog').on('click', function (e) {
        e.preventDefault()
        var blog = new Blog({
            author: $('#author').val(),
            title: $('#title').val(),
            url: $('#url').val(),
        });
        $('#author').val('');
        $('#title').val('');
        $('#url').val('')
        console.log(blog.toJSON())
        blogs.add(blog)
    })
})
