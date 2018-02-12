/* *******************************************************************************************
 * MOLECULER DB CHEATSHEET
 * https://github.com/ice-services/moleculer-db/tree/master/packages/moleculer-db#readme
 *
 * Version: 0.6.x
 * ******************************************************************************************* */

/* *******************************************************************************************
 * Install Moleculer DB
 * ******************************************************************************************* */

```bash
npm i moleculer-db
```

/* *******************************************************************************************
 * USAGE
 * ******************************************************************************************* */
const DbService = require("moleculer-db");

module.exports = {
    name: "users",
    mixins: [DbService],

    settings: {
        fields: ["_id", "username", "name"]
    },

    afterConnected() {
        // Seed the DB if you want
    }
}

/* *******************************************************************************************
 * SETTINGS
 * ******************************************************************************************* */

module.exports = {
    settings: {
        // Name of ID field
        idField: "_id",

        // Field filter list
        fields: ["_id", "title", "content"],

        // Schema of population
        populates: {
            // Shorthand populate rule. Resolve the `voters` values with `users.get` action.
            "voters": "users.get",

            // Define the params of action call. It will receive only with username & full name of author.
            "author": {
                action: "users.get",
                params: {
                    fields: "title fullName"
                },

                // Custom populator handler function (virtual field)
                "votes"(ids, rule, ctx) {
                    return this.Promise.all(books.map(async post => post.votes = await ctx.call("votes.count", { query: { post: post._id } })));
                }
            },
        },

        // Default page size in list action.
        pageSize: 10,

        // Maximum page size in list action.
        maxPageSize: 50,

        // Maximum value of limit in find action. Default: -1 (no limit)
        maxLimit: -1,

        // Validator schema or a function to validate the incoming entity in create & 'insert' actions.
        entityValidator: {
            username: { type: "string", min: 6 },
            content: { type: "string" }
        }
    },
}

/* *******************************************************************************************
 * EXPOSED ACTIONS
 * ******************************************************************************************* */

// Find entities with limit, offset & sort
broker.call("posts.find", { limit: 20, offset: 10, sort: ["-createdAt"] });
// Find with custom query, populate & fields
broker.call("posts.find", { query: { title: "First post" }, populate: ["author"], fields: ["title", "author.name"]});
// Find with full-text search (if adapter supports)
broker.call("posts.find", { search: "lorem" });

// Count of entities
broker.call("posts.count");
// Count with custom query
broker.call("posts.count", { query: { title: "First post" }});
// Count with full-text search (if adapter supports)
broker.call("posts.count", { search: "lorem" });

// List entities with paging
broker.call("posts.list", { page: 5, pageSize: 10, sort: ["-createdAt"] });
// List with custom query, populate & fields
broker.call("posts.list", { query: { title: "First post" }, populate: ["author"], fields: ["title", "author.name"]});
// List with full-text search (if adapter supports)
broker.call("posts.list", { search: "lorem" });

// Create an entity
broker.call("posts.create", { title: "New port", content: "My content" });

// Create multiple entities
broker.call("posts.insert", { entities: [
    { title: "First post", content: "First content" },
    { title: "Second post", content: "Second content" }
]});

// Get entity by ID
broker.call("posts.get", { id: 3, fields: ["title"] });
// Get entity with populate & fields
broker.call("posts.get", { id: [3, 5, 8], populate: ["author"], fields: ["title", "author.name"] });

// Update entity
broker.call("posts.update", { id: 5, title: "Modified title" });

// Remove entity
broker.call("posts.remove", { id: 5 });

/* *******************************************************************************************
 * METHODS
 * ******************************************************************************************* */

this.getById(5);                                // Get entity(ies) by ID(s).
this.getById("100");
this.getById([1, 3, 6, 8, 10]);

this.clearCache();                              // Clear cached entities
this.encodeID();                                // Encode ID of entity.
this.decodeID();                                // Decode ID of entity.

this.sanitizeParams(ctx, params);               // Sanitize context parameters at `find` action.
this.transformDocuments(ctx, params, docs);     // Transform the fetched documents
this.validateEntity(entity);                    // Validate an entity by validator.

/* *******************************************************************************************
 * ADAPTERS METHODS
 * ******************************************************************************************* */
this.adapter.find(filters);
this.adapter.findOne(filters);
this.adapter.findById(id);
this.adapter.findByIds(ids);
this.adapter.count(filters);
this.adapter.insert(entity);
this.adapter.insertMany(entities);
this.adapter.updateMany(query, update);
this.adapter.updateById(id, update);
this.adapter.removeMany(query);
this.adapter.removeById(id);
this.adapter.clear();
this.adapter.entityToObject();
this.adapter.createCursor(params);
