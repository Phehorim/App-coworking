//enable s-u-calendar datepicker for booking forms
$('#calendar1, #calendar2, #calendar3').calendar({
  type: 'date',
  formatter: {
    date: function(date, settings) {
      if (!date) {
        return ''
      }
      var start = moment(date).format('YYYY-MM-DD')
      $('.start-input').attr('value', start)
      return start
    }
  },
  text: {
    days: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    monthsShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
  }
})
