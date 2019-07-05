// Module Start
// JS imports
import $ from 'jquery';

/**
 * @description Character generator UX setter
 * @author Luca Cattide
 * @date 2019-07-05
 * @export
 */
export default function setForm() {
  $(document).ready(() => {
    // Name
    $('.label__field--culture').on('change', function() {
      if ($(this).val().indexOf('roman') !== -1) {
        $.getJSON('/src/assets/js/names.json')
          .done((data) => {
            $.each(data.culture, (i, element) => {
              if (element.type === 'roman') {
                const total = element.names.length;
                const index = Math.floor(Math.random() * total) + 1;

                $('.label__field--name').val(element.names[index]);
                $('.label__field--name').removeAttr('disabled');
              }
            });
          })
          .fail((xhr, status, message) => {
            console.log(`${status}: ${message}`);
          });
      }
    });
    // Tips
    $('.fields__label').on('click tap', function() {
      if (($(this).hasClass('fields__label--female')) &&
        ($('.label__field', this).is(':checked'))) {
        $(this).closest('.character-generator-form__fields')
          .next('.character-generator-form__tips')
          .removeClass('hidden');
      } else {
        $('.character-generator-form__tips').addClass('hidden');
      }
    });
  });
}
// Module End
