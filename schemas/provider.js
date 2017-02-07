module.exports = {
	"id": "Provider",
	"properties": {
		"name": {
			"type": "string",
			"description": "The full name of the dataset provider"
		},
		"description": {
			"type": "string",
			"description": "A small bio of the dataset Provider"
		},
		"books": {
			"type": "array",
			"description": "The list of books published on at least one of the stores by this author",
			"items": {
				"$ref": "Book"
			}
		},
		"website": {
			"type": "string",
			"description": "The Website url of the author"
		},
		"avatar": {
			"type": "string",
			"description": "The url for the avatar of this author"
		},
		"address": {
			"type": "object",
			"properties": {
				"street": {
					"type": "string"
				},
				"house_number": {
					"type": "integer"
				}
			}
		}
	}
}	