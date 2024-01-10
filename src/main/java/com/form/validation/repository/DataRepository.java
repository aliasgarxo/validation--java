package com.form.validation.repository;

import com.form.validation.entity.DataEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DataRepository extends JpaRepository<DataEntity,Long> {
    DataEntity findByUsernameAndPassword(String username, String password);


}
