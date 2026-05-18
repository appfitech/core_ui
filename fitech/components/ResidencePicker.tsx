import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import {
  getDepartments,
  getDistricts,
  getProvinces,
  getUbigeoData,
} from 'ubigeo-fns';

type Option = {
  label: string;
  value: string;
};

export function ResidencePicker() {
  const [departmentCode, setDepartmentCode] = useState<string | null>(null);
  const [provinceCode, setProvinceCode] = useState<string | null>(null);
  const [districtCode, setDistrictCode] = useState<string | null>(null);

  const departmentOptions: Option[] = useMemo(() => {
    return getDepartments().map((department) => ({
      label: department.name,
      value: department.code,
    }));
  }, []);

  const provinceOptions: Option[] = useMemo(() => {
    if (!departmentCode) return [];

    return getProvinces(departmentCode).map((province) => ({
      label: province.name,
      value: province.code,
    }));
  }, [departmentCode]);

  const districtOptions: Option[] = useMemo(() => {
    if (!provinceCode) return [];

    return getDistricts(provinceCode).map((district) => ({
      label: district.name,
      value: district.code,
    }));
  }, [provinceCode]);

  const selectedResidence = districtCode ? getUbigeoData(districtCode) : null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Departamento</Text>

      <Dropdown
        data={departmentOptions}
        labelField="label"
        valueField="value"
        value={departmentCode}
        placeholder="Selecciona departamento"
        search
        searchPlaceholder="Buscar departamento..."
        onChange={(item: Option) => {
          setDepartmentCode(item.value);
          setProvinceCode(null);
          setDistrictCode(null);
        }}
        style={styles.dropdown}
      />

      <Text style={styles.label}>Provincia</Text>

      <Dropdown
        data={provinceOptions}
        labelField="label"
        valueField="value"
        value={provinceCode}
        placeholder="Selecciona provincia"
        search
        searchPlaceholder="Buscar provincia..."
        disable={!departmentCode}
        onChange={(item: Option) => {
          setProvinceCode(item.value);
          setDistrictCode(null);
        }}
        style={styles.dropdown}
      />

      <Text style={styles.label}>Distrito</Text>

      <Dropdown
        data={districtOptions}
        labelField="label"
        valueField="value"
        value={districtCode}
        placeholder="Selecciona distrito"
        search
        searchPlaceholder="Buscar distrito..."
        disable={!provinceCode}
        onChange={(item: Option) => {
          setDistrictCode(item.value);

          const residence = getUbigeoData(item.value);

          console.log('Residence to save:', residence);
        }}
        style={styles.dropdown}
      />

      {selectedResidence && (
        <Text style={styles.selectedText}>
          {selectedResidence.district}, {selectedResidence.province},{' '}
          {selectedResidence.department}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  dropdown: {
    height: 52,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: '#FFF',
  },
  selectedText: {
    marginTop: 8,
    fontSize: 14,
    color: '#555',
  },
});
