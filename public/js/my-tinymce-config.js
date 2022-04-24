tinymce.init({
    selector: 'textarea#tinymce',
    height: 500,
    plugins: 'lists link image table code help wordcount',
    toolbar: 'undo redo | casechange blocks | bold italic backcolor | ' +
     'alignleft aligncenter alignright alignjustify | ' +
     'bullist numlist checklist outdent indent | removeformat | a11ycheck code table help'
  });