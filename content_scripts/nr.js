function putShowRatings(jawBone, key) {
	// Fetch the title and year of the show for query in OMDB
	var title = jawBone.find("div.text").html();
	var metaElement = jawBone.find("div.meta");
	var year = metaElement.children("span.year").html();
	var ratingSpan = $('<span class="true-ratings"></span>').insertAfter(metaElement);

	// Query OMDB for the show data
	fetch("https://www.omdbapi.com/?t=" + title + "&y=" + year + "&apikey=" + key)
	.then(data => {
		if (data.status === 200) {
			return data.json();
		} else {
			throw data.statusText + " " + data.status;
		}
	})
	.then(json => {
		if ("Ratings" in json && json.Ratings.length > 0) {
			// If ratings are included in the json from OMDB, add them to the jawBone element
			for (rating in json.Ratings) {
				var source = json.Ratings[rating].Source;
				var value = json.Ratings[rating].Value;
				ratingSpan.append('<div class="rating-success"><b>' + source + ': ' + value + '</b></div>');
			}
		} else {
			ratingSpan.append('<div class="rating-error">No ratings available</div>');
		}
	})
	.catch(err => {
		console.log("OMDB query '" + title + "'("  + year + ") with key " + key + " failed:");
		console.log(err);
		ratingSpan.append('<div class="rating-error">Unable to retrieve ratings</div>');
	});
}

function createListener(item) {
	if ("key" in item && item.key) {
		// Keeps a jawBone object so it can check for any changes
		var jawBone = $(".jawBone");
		// Checks for any changes to the jawBone object every .25 seconds.
		// TODO: Ideally, an event listener would activate anytime a new jawBone object appeared.
		setInterval(function() {
			if ($(".jawBone").length && !jawBone.is($(".jawBone"))) {
				jawBone = $(".jawBone");
				putShowRatings(jawBone, item.key);
			}
		}, 100);
	} else {
		window.alert("No OMDB API key found.\nIf you wish to use NetflixRatings, please click the icon and enter a key.");
	}
}

function onError(error) {
	console.log(`Error: ${error}`);
}

$(document).ready(function() {
	let getting = browser.storage.local.get("key");
	getting.then(createListener, onError);
});
