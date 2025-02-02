import { BooleanPicker } from './booleanPicker';
import { SelectPicker } from './SelectPicker';
import { InputPicker } from './InputPicker';
// eslint-disable-next-line
import { ScripturePicker } from './ScripturePicker';
import { ListPicker } from './ListPicker';
import { RessourcePicker } from './RessourcePicker';
import { IntPicker } from './IntPicker';

export function FieldPicker({
  fieldInfo,
  doReset,
  setJsonSpec,
  lang,
  open,
}) {
  const require = fieldInfo.nValues[0] > 0;
  // console.log("reload of FieldPicker :", JSON.parse(jsonSpecEntry));

  if (typeof fieldInfo.typeLiteral === typeof true || fieldInfo.typeLiteral) {
    setJsonSpec((prev) => {
      const newState = typeof prev === 'object' ? prev : JSON.parse(prev);
      newState[fieldInfo.id] = fieldInfo.typeLiteral;
      return JSON.stringify(newState);
    });

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div>
          {fieldInfo.label[lang]}
          {' '}
          :
        </div>
        <div style={{ fontSize: 16 }}>{fieldInfo.typeLiteral}</div>
      </div>
    );
  }
  if (fieldInfo.typeEnum) {
    // there only one resource to pick
    if (fieldInfo.nValues[1] === 1) {
      // console.log(fieldInfo);
      return (
        <SelectPicker
          doReset={doReset}
          setJsonSpec={setJsonSpec}
          fieldInfo={fieldInfo}
          require={require}
          lang={lang}
          open={open}
        />
      );
    }
  } else if (fieldInfo.id && fieldInfo.id === 'lhs' && fieldInfo.nValues[1] && fieldInfo.nValues[1] > 1) {
    return (
      <ListPicker
        setJsonSpec={setJsonSpec}
        fieldInfo={fieldInfo}
        require={require}
        lang={lang}
        open={open}
      />
    );
  } else if (fieldInfo.typeName && fieldInfo.typeName === 'boolean') {
    return (
      <BooleanPicker
        doReset={doReset}
        setJsonSpec={setJsonSpec}
        fieldInfo={fieldInfo}
        require={require}
        lang={lang}
        open={open}
      />
    );
  } else if (fieldInfo.typeName && fieldInfo.typeName === 'string') {
    return (
      <InputPicker
        doReset={doReset}
        setJsonSpec={setJsonSpec}
        fieldInfo={fieldInfo}
        require={require}
        lang={lang}
        open={open}
      />
    );
  } else if (fieldInfo.id === 'scripture') {
    return (
      <ScripturePicker
        doReset={doReset}
        setJsonSpec={setJsonSpec}
        fieldInfo={fieldInfo}
        lang={lang}
        open={open}
      />
    );
  } else if (
    fieldInfo.typeName === 'translationText'
    || fieldInfo.typeName === 'tNotes'
    || fieldInfo.id === 'glossNotes'
    || fieldInfo.typeName === 'obs'
    || fieldInfo.typeName === 'juxta'
    || fieldInfo.typeName === 'md'
    || fieldInfo.typeName === 'obsNotes'
    || fieldInfo.typeName === 'html'
  ) {
    if (!['scriptureSrc', 'obs'].includes(fieldInfo.id)) {
      return (
        <RessourcePicker
          doReset={doReset}
          setJsonSpec={setJsonSpec}
          fieldInfo={fieldInfo}
          ressourceKey={fieldInfo.typeName}
          ressourceName={fieldInfo.label.en}
          require={require}
          open={open}
        />
      );
    }
  } else if (
    fieldInfo.typeName === 'integer'
    || fieldInfo.typeName === 'number'
  ) {
    return (
      <IntPicker
        doReset={doReset}
        setJsonSpec={setJsonSpec}
        fieldInfo={fieldInfo}
        lang={lang}
        open={open}
        require={require}
      />
    );
  } else {
    // return (
    //   <InputPicker
    //     setJsonSpec={setJsonSpec}
    //     fieldInfo={fieldInfo}
    //     require={require}
    //     lang={lang}
    //     open={open}
    //   />
    // );
    // console.log(fieldInfo);
    return (
      <div>
        {fieldInfo.id}
        {' '}
        : picker not found
      </div>
    );
  }
}
