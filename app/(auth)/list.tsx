import { View, StyleSheet, TouchableOpacity, ScrollView, Modal, Image, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../provider/AuthProvider';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../../config/initSupabase';
import { FileObject } from '@supabase/storage-js';
import ImageItem from '@/components/ImageItem';

const List = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileObject[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<{ item: FileObject, index: number } | null>(null);

  useEffect(() => {
    if (!user) return;

    // Load user images
    loadImages();
  }, [user]);

  const loadImages = async () => {
    const { data } = await supabase.storage.from('files').list(user!.id);
    if (data) {
      setFiles(data);
    }
  };

  const onSelectImage = async () => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    // Save image if not cancelled
    if (!result.canceled) {
      const img = result.assets[0];
      const base64 = await FileSystem.readAsStringAsync(img.uri, { encoding: 'base64' });
      const filePath = `${user!.id}/${new Date().getTime()}.${img.type === 'image' ? 'png' : 'mp4'}`;
      const contentType = img.type === 'image' ? 'image/png' : 'video/mp4';
      await supabase.storage.from('files').upload(filePath, decode(base64), { contentType });
      loadImages();
    }
  };

  const onRemoveImage = async () => {
    if (imageToDelete) {
      supabase.storage.from('files').remove([`${user!.id}/${imageToDelete.item.name}`]);
      const newFiles = [...files];
      newFiles.splice(imageToDelete.index, 1);
      setFiles(newFiles);
      setConfirmModalVisible(false);
      setImageToDelete(null);
    }
  };

  const onImagePress = (imageUri: string) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const confirmRemoveImage = (item: FileObject, index: number) => {
    setImageToDelete({ item, index });
    setConfirmModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {files.map((item, index) => (
          <ImageItem key={item.id} item={item} userId={user!.id} onRemoveImage={() => confirmRemoveImage(item, index)} onImagePress={onImagePress} />
        ))}
      </ScrollView>

      <TouchableOpacity onPress={onSelectImage} style={styles.fab}>
        <Ionicons name="camera-outline" size={30} color={'#fff'} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Ionicons name="close" size={30}/>
          </TouchableOpacity>
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.imagePreview} />}
        </View>
      </Modal>

      <Modal visible={confirmModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.confirmText}>¿Estás seguro de que deseas eliminar esta imagen?</Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity onPress={onRemoveImage} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Sí</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setConfirmModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#151515',
  },
  fab: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    position: 'absolute',
    bottom: 40,
    right: 30,
    height: 70,
    backgroundColor: '#2b825b',
    borderRadius: 100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#000',
  },
  imagePreview: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
  confirmText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#ff6347',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    flex: 1,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#808080', // Color gris para el botón de cancelación
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10,
    flex: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default List;