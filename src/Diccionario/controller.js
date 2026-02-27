exports.getDictionary = (req, res) => {
    res.render('diccionario', {
        title: "Diccionario de términos de ciberseguridad",
        backLink: "/Diccionario"
    });
}