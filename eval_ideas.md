- Check if query is going to return a ton of results or be expensive

- This was wrong. maybe we should have an eval for it?
    How many sets are there in each themegroup? order by most
    SELECT themegroup,COUNT(*) FROM lego_sets GROUP BY themegroup ORDER BY themegroup DESC
